from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    client: MongoClient = None
    database: Database = None

mongo_db = MongoDB()

def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/express_english_hub")
    mongo_db.client = MongoClient(mongo_url)
    
    # Extract database name from URL or use default
    if "/" in mongo_url:
        db_name = mongo_url.split("/")[-1]
    else:
        db_name = "express_english_hub"
    
    mongo_db.database = mongo_db.client[db_name]
    print(f"Connected to MongoDB: {db_name}")

def close_mongo_connection():
    """Close database connection"""
    if mongo_db.client:
        mongo_db.client.close()

def get_database() -> Database:
    """Get database instance"""
    if not mongo_db.database:
        connect_to_mongo()
    return mongo_db.database

def get_collection(collection_name: str) -> Collection:
    """Get collection instance"""
    db = get_database()
    return db[collection_name]