#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Express English Hub
Tests all FastAPI endpoints with authentication, article management, configuration, and error handling
"""

import requests
import json
import time
import os
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

# Test credentials
ADMIN_USERNAME = "Reze"
ADMIN_PASSWORD = "Denji"

# Global variables for test state
auth_token = None
test_results = []
generated_articles = []

def log_test(test_name, status, details=""):
    """Log test results"""
    result = {
        "test": test_name,
        "status": status,
        "details": details,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    test_results.append(result)
    status_symbol = "✅" if status == "PASS" else "❌"
    print(f"{status_symbol} {test_name}: {status}")
    if details:
        print(f"   Details: {details}")

def test_health_check():
    """Test health check endpoint"""
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                log_test("Health Check", "PASS", f"Service healthy: {data.get('service')}")
                return True
            else:
                log_test("Health Check", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("Health Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Health Check", "FAIL", f"Exception: {str(e)}")
        return False

def test_root_endpoint():
    """Test root API endpoint"""
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Express English Hub API":
                log_test("Root Endpoint", "PASS", f"Version: {data.get('version')}")
                return True
            else:
                log_test("Root Endpoint", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("Root Endpoint", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Root Endpoint", "FAIL", f"Exception: {str(e)}")
        return False

def test_login():
    """Test admin login"""
    global auth_token
    try:
        login_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        response = requests.post(f"{API_BASE}/login", json=login_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("token"):
                auth_token = data["token"]
                log_test("Admin Login", "PASS", f"Token received for user: {data.get('username')}")
                return True
            else:
                log_test("Admin Login", "FAIL", f"Login failed: {data}")
                return False
        else:
            log_test("Admin Login", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Admin Login", "FAIL", f"Exception: {str(e)}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    try:
        login_data = {
            "username": "invalid_user",
            "password": "wrong_password"
        }
        response = requests.post(f"{API_BASE}/login", json=login_data, timeout=10)
        
        if response.status_code == 401:
            log_test("Invalid Login", "PASS", "Correctly rejected invalid credentials")
            return True
        else:
            log_test("Invalid Login", "FAIL", f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Invalid Login", "FAIL", f"Exception: {str(e)}")
        return False

def test_auth_check():
    """Test authentication check"""
    if not auth_token:
        log_test("Auth Check", "SKIP", "No auth token available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_BASE}/auth-check", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("authenticated") and data.get("username") == ADMIN_USERNAME:
                log_test("Auth Check", "PASS", f"Authenticated as: {data.get('username')}")
                return True
            else:
                log_test("Auth Check", "FAIL", f"Authentication failed: {data}")
                return False
        else:
            log_test("Auth Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Auth Check", "FAIL", f"Exception: {str(e)}")
        return False

def test_auth_check_without_token():
    """Test auth check without token"""
    try:
        response = requests.get(f"{API_BASE}/auth-check", timeout=10)
        
        if response.status_code == 403:
            log_test("Auth Check Without Token", "PASS", "Correctly rejected request without token")
            return True
        else:
            log_test("Auth Check Without Token", "FAIL", f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth Check Without Token", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_articles():
    """Test getting all articles"""
    try:
        response = requests.get(f"{API_BASE}/articles", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "articles" in data:
                article_count = data.get("count", 0)
                log_test("Get Articles", "PASS", f"Retrieved {article_count} articles")
                return True
            else:
                log_test("Get Articles", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("Get Articles", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Get Articles", "FAIL", f"Exception: {str(e)}")
        return False

def test_generate_article():
    """Test article generation with OpenRouter API"""
    global generated_articles
    
    if not auth_token:
        log_test("Generate Article", "SKIP", "No auth token available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        article_data = {
            "keywords": "TOEFL Reading Tips",
            "count": 1,
            "language": "en"
        }
        
        response = requests.post(f"{API_BASE}/generate-article", json=article_data, headers=headers, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("articles"):
                generated_articles = data["articles"]
                article_count = data.get("count", 0)
                log_test("Generate Article", "PASS", f"Generated {article_count} article(s) with keywords: TOEFL Reading Tips")
                return True
            else:
                log_test("Generate Article", "FAIL", f"Generation failed: {data}")
                return False
        else:
            log_test("Generate Article", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Generate Article", "FAIL", f"Exception: {str(e)}")
        return False

def test_generate_article_without_auth():
    """Test article generation without authentication"""
    try:
        article_data = {
            "keywords": "Test Article",
            "count": 1,
            "language": "en"
        }
        
        response = requests.post(f"{API_BASE}/generate-article", json=article_data, timeout=10)
        
        if response.status_code == 403:
            log_test("Generate Article Without Auth", "PASS", "Correctly rejected unauthenticated request")
            return True
        else:
            log_test("Generate Article Without Auth", "FAIL", f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Generate Article Without Auth", "FAIL", f"Exception: {str(e)}")
        return False

def test_delete_article():
    """Test article deletion"""
    if not auth_token:
        log_test("Delete Article", "SKIP", "No auth token available")
        return False
        
    if not generated_articles:
        log_test("Delete Article", "SKIP", "No generated articles to delete")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        filename = generated_articles[0]["filename"]
        
        response = requests.delete(f"{API_BASE}/delete-article?filename={filename}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Delete Article", "PASS", f"Successfully deleted article: {filename}")
                return True
            else:
                log_test("Delete Article", "FAIL", f"Deletion failed: {data}")
                return False
        else:
            log_test("Delete Article", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Delete Article", "FAIL", f"Exception: {str(e)}")
        return False

def test_delete_nonexistent_article():
    """Test deleting non-existent article"""
    if not auth_token:
        log_test("Delete Nonexistent Article", "SKIP", "No auth token available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        filename = "nonexistent_article.html"
        
        response = requests.delete(f"{API_BASE}/delete-article?filename={filename}", headers=headers, timeout=10)
        
        if response.status_code == 404:
            log_test("Delete Nonexistent Article", "PASS", "Correctly returned 404 for non-existent article")
            return True
        else:
            log_test("Delete Nonexistent Article", "FAIL", f"Expected 404, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Delete Nonexistent Article", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_config():
    """Test getting configuration"""
    if not auth_token:
        log_test("Get Config", "SKIP", "No auth token available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_BASE}/config", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("config"):
                config = data["config"]
                log_test("Get Config", "PASS", f"Retrieved config - Model: {config.get('openrouter_model')}")
                return True
            else:
                log_test("Get Config", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("Get Config", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Get Config", "FAIL", f"Exception: {str(e)}")
        return False

def test_update_config():
    """Test updating configuration"""
    if not auth_token:
        log_test("Update Config", "SKIP", "No auth token available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        config_data = {
            "openrouter_model": "google/gemini-2.5-flash"
        }
        
        response = requests.post(f"{API_BASE}/config", json=config_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Update Config", "PASS", "Configuration updated successfully")
                return True
            else:
                log_test("Update Config", "FAIL", f"Update failed: {data}")
                return False
        else:
            log_test("Update Config", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Update Config", "FAIL", f"Exception: {str(e)}")
        return False

def test_contact_form():
    """Test contact form submission"""
    try:
        contact_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "subject": "Test Contact",
            "message": "This is a test message for the contact form functionality.",
            "program": "TOEFL ITP"
        }
        
        response = requests.post(f"{API_BASE}/contact", json=contact_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Contact Form", "PASS", "Contact form submitted successfully")
                return True
            else:
                log_test("Contact Form", "FAIL", f"Submission failed: {data}")
                return False
        else:
            log_test("Contact Form", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Contact Form", "FAIL", f"Exception: {str(e)}")
        return False

def test_contact_form_validation():
    """Test contact form validation with invalid data"""
    try:
        contact_data = {
            "name": "Test User",
            "email": "invalid-email",
            "message": "Short"  # Too short message
        }
        
        response = requests.post(f"{API_BASE}/contact", json=contact_data, timeout=10)
        
        if response.status_code == 422:  # Validation error
            log_test("Contact Form Validation", "PASS", "Correctly rejected invalid contact data")
            return True
        else:
            log_test("Contact Form Validation", "FAIL", f"Expected 422, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Contact Form Validation", "FAIL", f"Exception: {str(e)}")
        return False

def test_logout():
    """Test logout functionality"""
    if not auth_token:
        log_test("Logout", "SKIP", "No auth token available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{API_BASE}/logout", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Logout", "PASS", "Logout successful")
                return True
            else:
                log_test("Logout", "FAIL", f"Logout failed: {data}")
                return False
        else:
            log_test("Logout", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Logout", "FAIL", f"Exception: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("🚀 Starting Express English Hub Backend API Tests")
    print("=" * 60)
    
    # Basic connectivity tests
    test_health_check()
    test_root_endpoint()
    
    # Authentication tests
    test_invalid_login()
    test_login()
    test_auth_check()
    test_auth_check_without_token()
    
    # Article management tests
    test_get_articles()
    test_generate_article_without_auth()
    test_generate_article()
    test_delete_article()
    test_delete_nonexistent_article()
    
    # Configuration tests
    test_get_config()
    test_update_config()
    
    # Contact form tests
    test_contact_form()
    test_contact_form_validation()
    
    # Logout test
    test_logout()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in test_results if result["status"] == "PASS")
    failed = sum(1 for result in test_results if result["status"] == "FAIL")
    skipped = sum(1 for result in test_results if result["status"] == "SKIP")
    total = len(test_results)
    
    print(f"Total Tests: {total}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"⏭️  Skipped: {skipped}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if failed > 0:
        print("\n❌ FAILED TESTS:")
        for result in test_results:
            if result["status"] == "FAIL":
                print(f"  - {result['test']}: {result['details']}")
    
    return passed, failed, skipped

if __name__ == "__main__":
    try:
        passed, failed, skipped = run_all_tests()
        
        # Save detailed results
        with open("/app/backend_test_results.json", "w") as f:
            json.dump({
                "summary": {
                    "total": len(test_results),
                    "passed": passed,
                    "failed": failed,
                    "skipped": skipped,
                    "success_rate": f"{(passed/len(test_results))*100:.1f}%"
                },
                "tests": test_results,
                "timestamp": datetime.now().isoformat()
            }, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
        
        # Exit with appropriate code
        exit(0 if failed == 0 else 1)
        
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n💥 Test execution failed: {str(e)}")
        exit(1)