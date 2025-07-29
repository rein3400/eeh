from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import json
import httpx
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import re
import uuid
from pathlib import Path
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import zipfile
import shutil
from bs4 import BeautifulSoup
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our modules
from models import ArticleCreate, Article, ContactRequest, ConfigUpdate, SEOAnalysisRequest, PluginAction
from database import connect_to_mongo, get_collection, get_database
from auth import get_current_user, verify_ip_whitelist

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Express English Hub API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    try:
        connect_to_mongo()
        logger.info("Database connected successfully")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")

# Utility functions
def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    # Remove HTML tags
    filename = re.sub('<.*?>', '', filename)
    # Replace spaces with underscores
    filename = filename.replace(' ', '_')
    # Remove special characters
    filename = re.sub(r'[^a-zA-Z0-9_-]', '', filename)
    # Limit length
    return filename[:50]

def get_openrouter_config():
    """Get OpenRouter configuration"""
    # Try to get from database config first
    config_collection = get_collection("config")
    config = config_collection.find_one({"type": "openrouter"})
    
    if config:
        return {
            "api_key": config.get("api_key", os.getenv("OPENROUTER_API_KEY")),
            "model": config.get("model", os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash"))
        }
    
    return {
        "api_key": os.getenv("OPENROUTER_API_KEY", "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"),
        "model": os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash")
    }

# IP Whitelisting endpoint
@app.get("/api/admin-access")
async def admin_access_check(request: Request):
    """Check if IP is whitelisted for admin access"""
    try:
        verification = verify_ip_whitelist(request)
        return {
            "success": True,
            "authorized": True,
            "ip": verification["ip"],
            "message": "Access granted"
        }
    except HTTPException as e:
        return {
            "success": False,
            "authorized": False,
            "message": e.detail
        }
    except Exception as e:
        logger.error(f"Admin access check error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Access check error: {str(e)}"
        )

# Articles endpoints
@app.get("/api/articles")
async def get_articles():
    """Get all articles"""
    try:
        articles_collection = get_collection("articles")
        articles_list = []
        
        # Get articles from database
        articles = articles_collection.find().sort("created", -1)
        
        for article in articles:
            articles_list.append({
                "title": article.get("title", ""),
                "filename": article.get("filename", ""),
                "created": article.get("created", datetime.now()).strftime("%Y-%m-%d %H:%M:%S") if isinstance(article.get("created"), datetime) else str(article.get("created", "")),
                "size": article.get("size", 0),
                "id": article.get("id", str(article.get("_id", "")))
            })
        
        return {
            "success": True,
            "articles": articles_list,
            "count": len(articles_list)
        }
    except Exception as e:
        logger.error(f"Get articles error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/api/generate-article")
async def generate_article(request: ArticleCreate, req: Request, current_user: dict = Depends(get_current_user)):
    """Generate articles using OpenRouter API"""
    try:
        openrouter_config = get_openrouter_config()
        api_key = openrouter_config["api_key"] 
        model = openrouter_config["model"]
        
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OpenRouter API key not configured"
            )
        
        # Language-specific prompts
        prompts = {
            'id': f"""Buat artikel blog berkualitas tinggi tentang TOEFL dengan keyword: {request.keywords}. 
            Artikel harus:
            - Minimal 800 kata
            - Informatif dan edukatif
            - Menggunakan struktur HTML yang proper
            - Memiliki judul yang menarik
            - Menggunakan heading (h1, h2, h3)
            - Memiliki meta description
            - SEO friendly
            - Dalam bahasa Indonesia yang baik dan benar
            
            Format output harus berupa HTML lengkap dengan struktur:
            <!DOCTYPE html>
            <html>
            <head>
                <title>[Judul Artikel]</title>
                <meta name="description" content="[Meta description]">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }}
                    h1, h2, h3 {{ color: #e97311; }}
                    .meta {{ color: #666; font-size: 14px; margin-bottom: 20px; }}
                </style>
            </head>
            <body>
                [Konten artikel dengan struktur HTML yang proper]
            </body>
            </html>""",
            
            'en': f"""Create a high-quality TOEFL blog article with keywords: {request.keywords}.
            The article should:
            - Be at least 800 words
            - Be informative and educational
            - Use proper HTML structure
            - Have an engaging title
            - Use headings (h1, h2, h3)
            - Include meta description
            - Be SEO friendly
            - Be written in proper English
            
            Output format should be complete HTML with structure:
            <!DOCTYPE html>
            <html>
            <head>
                <title>[Article Title]</title>
                <meta name="description" content="[Meta description]">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }}
                    h1, h2, h3 {{ color: #e97311; }}
                    .meta {{ color: #666; font-size: 14px; margin-bottom: 20px; }}
                </style>
            </head>
            <body>
                [Article content with proper HTML structure]
            </body>
            </html>"""
        }
        
        generated_articles = []
        
        for i in range(request.count):
            prompt = prompts.get(request.language, prompts['id'])
            
            request_data = {
                'model': model,
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 4000,
                'temperature': 0.7
            }
            
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'TOEFL Blog Generator'
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    json=request_data,
                    headers=headers
                )
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"API request failed with code: {response.status_code} Response: {response.text}"
                    )
                
                result = response.json()
                
                if not result or 'choices' not in result or not result['choices']:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Invalid API response"
                    )
                
                content = result['choices'][0]['message']['content']
                
                # Extract title from HTML content
                title_match = re.search(r'<title>(.*?)</title>', content)
                title = title_match.group(1) if title_match else f'Artikel TOEFL - {request.keywords}'
                
                # Generate filename
                filename = sanitize_filename(title) + '_' + datetime.now().strftime('%Y-%m-%d_%H-%M-%S') + f'_{i + 1}.html'
                
                # Save article to database
                article_data = {
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "filename": filename,
                    "content": content,
                    "created": datetime.now(),
                    "size": len(content.encode('utf-8')),
                    "keywords": request.keywords
                }
                
                articles_collection = get_collection("articles")
                articles_collection.insert_one(article_data)
                
                # Also save to file for cPanel compatibility
                articles_dir = Path("/app/articles")
                articles_dir.mkdir(exist_ok=True)
                
                with open(articles_dir / filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                generated_articles.append({
                    'title': title,
                    'filename': filename,
                    'created': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })
        
        return {
            'success': True,
            'count': len(generated_articles),
            'articles': generated_articles
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generate article error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.delete("/api/delete-article")
async def delete_article(filename: str, req: Request, current_user: dict = Depends(get_current_user)):
    """Delete article"""
    try:
        # Delete from database
        articles_collection = get_collection("articles")
        result = articles_collection.delete_one({"filename": filename})
        
        # Delete file if exists
        file_path = Path("/app/articles") / filename
        if file_path.exists():
            file_path.unlink()
        
        if result.deleted_count > 0:
            return {
                "success": True,
                "message": "Article deleted successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete article error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Configuration endpoints
@app.get("/api/config")
async def get_config(req: Request, current_user: dict = Depends(get_current_user)):
    """Get current configuration"""
    try:
        config = get_openrouter_config()
        
        return {
            "success": True,
            "config": {
                "openrouter_model": config["model"],
                "openrouter_api_key": config["api_key"][:10] + "..." if config["api_key"] else "Not set"
            }
        }
    except Exception as e:
        logger.error(f"Get config error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/api/config")
async def update_config(request: ConfigUpdate, req: Request, current_user: dict = Depends(get_current_user)):
    """Update configuration"""
    try:
        config_collection = get_collection("config")
        
        # Get current config
        current_config = config_collection.find_one({"type": "openrouter"}) or {}
        
        # Update only provided fields
        if request.openrouter_api_key:
            current_config["api_key"] = request.openrouter_api_key
        if request.openrouter_model:
            current_config["model"] = request.openrouter_model
        
        current_config["type"] = "openrouter"
        current_config["updated_at"] = datetime.now()
        
        # Upsert configuration
        config_collection.replace_one(
            {"type": "openrouter"},
            current_config,
            upsert=True
        )
        
        return {
            "success": True,
            "message": "Configuration updated successfully"
        }
        
    except Exception as e:
        logger.error(f"Update config error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Contact form endpoint
@app.post("/api/contact")
async def contact_form(request: ContactRequest):
    """Handle contact form submissions"""
    try:
        # Validate message length
        if len(request.message) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message must be at least 10 characters long"
            )
        
        # Store contact submission in database
        contacts_collection = get_collection("contacts")
        contact_data = {
            "id": str(uuid.uuid4()),
            "name": request.name,
            "email": request.email,
            "phone": request.phone,
            "subject": request.subject,
            "message": request.message,
            "program": request.program,
            "created": datetime.now(),
            "ip": "unknown"  # In a real app, you'd get this from the request
        }
        
        contacts_collection.insert_one(contact_data)
        
        return {
            "success": True,
            "message": "Thank you! Your message has been sent successfully. We will get back to you within 24 hours."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Contact form error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sorry, there was a problem sending your message. Please try again later or contact us directly."
        )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Express English Hub API"
    }

# Root endpoint
@app.get("/api/")
async def root():
    """Root API endpoint"""
    return {
        "message": "Express English Hub API",
        "version": "1.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)