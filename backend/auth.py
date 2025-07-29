import os
from typing import Optional
from fastapi import HTTPException, status, Request
from database import get_collection

# IP Whitelisting Configuration
WHITELISTED_IPS = ["192.168.100.15"]

def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    # Try to get real IP from headers (for reverse proxy setups)
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        # X-Forwarded-For can contain multiple IPs, get the first one
        return x_forwarded_for.split(",")[0].strip()
    
    x_real_ip = request.headers.get("X-Real-IP")
    if x_real_ip:
        return x_real_ip.strip()
    
    # Fallback to direct client IP
    return request.client.host

def verify_ip_whitelist(request: Request):
    """Verify if client IP is in whitelist"""
    client_ip = get_client_ip(request)
    
    if client_ip not in WHITELISTED_IPS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. IP {client_ip} is not whitelisted."
        )
    
    return {"ip": client_ip, "authorized": True}

def get_current_user(request: Request) -> dict:
    """Get current user based on IP whitelist"""
    verification = verify_ip_whitelist(request)
    return {
        "username": "admin",
        "ip": verification["ip"],
        "authorized": verification["authorized"]
    }

# Legacy authentication functions kept for backward compatibility only
def authenticate_user(username: str, password: str) -> bool:
    """Deprecated: Using IP whitelisting instead"""
    return False

def create_access_token(data: dict, expires_delta=None):
    """Deprecated: Using IP whitelisting instead"""
    return "deprecated"

def verify_token(token: str) -> dict:
    """Deprecated: Using IP whitelisting instead"""
    return {"sub": "deprecated"}

def create_session(username: str) -> str:
    """Deprecated: Using IP whitelisting instead"""
    return "deprecated"

def get_session(token: str) -> Optional[dict]:
    """Deprecated: Using IP whitelisting instead"""
    return None

def delete_session(token: str):
    """Deprecated: Using IP whitelisting instead"""
    pass