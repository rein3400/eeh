from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class ArticleCreate(BaseModel):
    keywords: str
    count: Optional[int] = 1
    language: Optional[str] = "id"

class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    filename: str
    content: str
    created: datetime = Field(default_factory=datetime.now)
    size: int
    keywords: str

# Legacy login models removed - now using IP whitelisting

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: Optional[str] = "Contact Form Submission"
    message: str
    program: Optional[str] = "General Inquiry"

class ConfigUpdate(BaseModel):
    openrouter_api_key: Optional[str] = None
    openrouter_model: Optional[str] = None

class SEOAnalysisRequest(BaseModel):
    action: str
    url: Optional[str] = None
    content: Optional[str] = None

class PluginAction(BaseModel):
    action: str
    plugin_name: Optional[str] = None
    hook: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class SessionData(BaseModel):
    admin_logged_in: bool = False
    admin_username: Optional[str] = None
    session_token: Optional[str] = None
    login_time: Optional[datetime] = None