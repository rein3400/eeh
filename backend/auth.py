import os
import uuid
import secrets
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import LoginRequest, LoginResponse, SessionData
from database import get_collection

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "express_english_hub_secret_key_2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def authenticate_user(username: str, password: str) -> bool:
    """Authenticate user against environment variables"""
    admin_username = os.getenv("ADMIN_USERNAME", "Reze")
    admin_password = os.getenv("ADMIN_PASSWORD", "Denji")
    
    return username == admin_username and password == admin_password

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    
    username = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"username": username}

# Session management for compatibility
sessions_collection = None

def get_sessions_collection():
    global sessions_collection
    if not sessions_collection:
        sessions_collection = get_collection("sessions")
    return sessions_collection

def create_session(username: str) -> str:
    """Create session for user"""
    session_token = secrets.token_hex(32)
    session_data = {
        "session_token": session_token,
        "admin_username": username,
        "admin_logged_in": True,
        "login_time": datetime.now(),
        "expires_at": datetime.now() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }
    
    collection = get_sessions_collection()
    collection.insert_one(session_data)
    return session_token

def get_session(token: str) -> Optional[dict]:
    """Get session data"""
    collection = get_sessions_collection()
    session = collection.find_one({"session_token": token})
    
    if not session:
        return None
    
    # Check if session expired
    if session.get("expires_at") and datetime.now() > session["expires_at"]:
        collection.delete_one({"session_token": token})
        return None
    
    return session

def delete_session(token: str):
    """Delete session"""
    collection = get_sessions_collection()
    collection.delete_one({"session_token": token})