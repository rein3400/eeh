from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import verify_ip_whitelist, get_current_user
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Apply IP whitelist middleware to all routes
app.dependency_overrides[get_current_user] = verify_ip_whitelist

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Express English Hub API"}

@app.get("/api/admin-access")
async def admin_access(user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "authorized": user["authorized"],
        "ip": user["ip"],
        "message": "Admin access granted"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)