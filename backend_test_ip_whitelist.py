#!/usr/bin/env python3
"""
Backend API Testing for Express English Hub - IP Whitelisting System
Tests the new IP whitelisting authentication system replacing JWT authentication
"""

import requests
import json
import time
import os
from datetime import datetime

# Configuration - Use localhost for internal testing
BACKEND_URL = "http://localhost:5000"
API_BASE = f"{BACKEND_URL}/api"

# IP Whitelisting configuration
WHITELISTED_IP = "192.168.1.15"  # Matches 192.168.1.0/24 CIDR range

# Global variables for test state
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

def test_admin_access_endpoint():
    """Test the new /api/admin-access endpoint for IP whitelisting"""
    try:
        # Test with headers simulating whitelisted IP
        headers = {
            "X-Forwarded-For": WHITELISTED_IP,
            "X-Real-IP": WHITELISTED_IP
        }
        response = requests.get(f"{API_BASE}/admin-access", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("authorized"):
                log_test("Admin Access - Whitelisted IP", "PASS", f"Access granted for IP: {data.get('ip')}")
                return True
            else:
                log_test("Admin Access - Whitelisted IP", "FAIL", f"Access denied: {data}")
                return False
        else:
            log_test("Admin Access - Whitelisted IP", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Admin Access - Whitelisted IP", "FAIL", f"Exception: {str(e)}")
        return False

def test_admin_access_non_whitelisted():
    """Test admin access with non-whitelisted IP"""
    try:
        # Test with headers simulating non-whitelisted IP
        headers = {
            "X-Forwarded-For": "192.168.1.100",
            "X-Real-IP": "192.168.1.100"
        }
        response = requests.get(f"{API_BASE}/admin-access", headers=headers, timeout=10)
        
        # Should return 200 but with authorized: false
        if response.status_code == 200:
            data = response.json()
            if not data.get("authorized"):
                log_test("Admin Access - Non-whitelisted IP", "PASS", "Correctly denied access for non-whitelisted IP")
                return True
            else:
                log_test("Admin Access - Non-whitelisted IP", "FAIL", f"Incorrectly granted access: {data}")
                return False
        else:
            log_test("Admin Access - Non-whitelisted IP", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Admin Access - Non-whitelisted IP", "FAIL", f"Exception: {str(e)}")
        return False

def test_old_auth_endpoints_removed():
    """Test that old JWT authentication endpoints are removed"""
    old_endpoints = ["/login", "/auth-check", "/logout"]
    
    for endpoint in old_endpoints:
        try:
            response = requests.get(f"{API_BASE}{endpoint}", timeout=10)
            if response.status_code == 404:
                log_test(f"Old Endpoint Removed - {endpoint}", "PASS", f"Endpoint {endpoint} correctly removed")
            else:
                log_test(f"Old Endpoint Removed - {endpoint}", "FAIL", f"Endpoint {endpoint} still exists: {response.status_code}")
                return False
        except Exception as e:
            log_test(f"Old Endpoint Removed - {endpoint}", "FAIL", f"Exception: {str(e)}")
            return False
    
    return True

def test_get_articles():
    """Test getting all articles (public endpoint)"""
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

def test_generate_article_with_ip_whitelist():
    """Test article generation with IP whitelisting"""
    global generated_articles
    
    try:
        # Simulate whitelisted IP
        headers = {
            "X-Forwarded-For": WHITELISTED_IP,
            "X-Real-IP": WHITELISTED_IP,
            "Content-Type": "application/json"
        }
        article_data = {
            "keywords": "TOEFL Speaking Practice",
            "count": 1,
            "language": "en"
        }
        
        response = requests.post(f"{API_BASE}/generate-article", json=article_data, headers=headers, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("articles"):
                generated_articles = data["articles"]
                article_count = data.get("count", 0)
                log_test("Generate Article - IP Whitelisted", "PASS", f"Generated {article_count} article(s) with IP whitelisting")
                return True
            else:
                log_test("Generate Article - IP Whitelisted", "FAIL", f"Generation failed: {data}")
                return False
        else:
            log_test("Generate Article - IP Whitelisted", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Generate Article - IP Whitelisted", "FAIL", f"Exception: {str(e)}")
        return False

def test_generate_article_without_whitelist():
    """Test article generation without IP whitelisting"""
    try:
        # Simulate non-whitelisted IP
        headers = {
            "X-Forwarded-For": "10.0.0.1",
            "X-Real-IP": "10.0.0.1",
            "Content-Type": "application/json"
        }
        article_data = {
            "keywords": "Test Article",
            "count": 1,
            "language": "en"
        }
        
        response = requests.post(f"{API_BASE}/generate-article", json=article_data, headers=headers, timeout=10)
        
        if response.status_code == 403:
            log_test("Generate Article - Non-whitelisted IP", "PASS", "Correctly rejected non-whitelisted IP")
            return True
        else:
            log_test("Generate Article - Non-whitelisted IP", "FAIL", f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Generate Article - Non-whitelisted IP", "FAIL", f"Exception: {str(e)}")
        return False

def test_delete_article_with_ip_whitelist():
    """Test article deletion with IP whitelisting"""
    if not generated_articles:
        log_test("Delete Article - IP Whitelisted", "SKIP", "No generated articles to delete")
        return False
        
    try:
        # Simulate whitelisted IP
        headers = {
            "X-Forwarded-For": WHITELISTED_IP,
            "X-Real-IP": WHITELISTED_IP
        }
        filename = generated_articles[0]["filename"]
        
        response = requests.delete(f"{API_BASE}/delete-article?filename={filename}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Delete Article - IP Whitelisted", "PASS", f"Successfully deleted article: {filename}")
                return True
            else:
                log_test("Delete Article - IP Whitelisted", "FAIL", f"Deletion failed: {data}")
                return False
        else:
            log_test("Delete Article - IP Whitelisted", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Delete Article - IP Whitelisted", "FAIL", f"Exception: {str(e)}")
        return False

def test_delete_article_without_whitelist():
    """Test article deletion without IP whitelisting"""
    try:
        # Simulate non-whitelisted IP
        headers = {
            "X-Forwarded-For": "172.16.0.1",
            "X-Real-IP": "172.16.0.1"
        }
        filename = "test_article.html"
        
        response = requests.delete(f"{API_BASE}/delete-article?filename={filename}", headers=headers, timeout=10)
        
        if response.status_code == 403:
            log_test("Delete Article - Non-whitelisted IP", "PASS", "Correctly rejected non-whitelisted IP")
            return True
        else:
            log_test("Delete Article - Non-whitelisted IP", "FAIL", f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Delete Article - Non-whitelisted IP", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_config_with_ip_whitelist():
    """Test getting configuration with IP whitelisting"""
    try:
        # Simulate whitelisted IP
        headers = {
            "X-Forwarded-For": WHITELISTED_IP,
            "X-Real-IP": WHITELISTED_IP
        }
        response = requests.get(f"{API_BASE}/config", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("config"):
                config = data["config"]
                log_test("Get Config - IP Whitelisted", "PASS", f"Retrieved config - Model: {config.get('openrouter_model')}")
                return True
            else:
                log_test("Get Config - IP Whitelisted", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("Get Config - IP Whitelisted", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Get Config - IP Whitelisted", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_config_without_whitelist():
    """Test getting configuration without IP whitelisting"""
    try:
        # Simulate non-whitelisted IP
        headers = {
            "X-Forwarded-For": "203.0.113.1",
            "X-Real-IP": "203.0.113.1"
        }
        response = requests.get(f"{API_BASE}/config", headers=headers, timeout=10)
        
        if response.status_code == 403:
            log_test("Get Config - Non-whitelisted IP", "PASS", "Correctly rejected non-whitelisted IP")
            return True
        else:
            log_test("Get Config - Non-whitelisted IP", "FAIL", f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Get Config - Non-whitelisted IP", "FAIL", f"Exception: {str(e)}")
        return False

def test_update_config_with_ip_whitelist():
    """Test updating configuration with IP whitelisting"""
    try:
        # Simulate whitelisted IP
        headers = {
            "X-Forwarded-For": WHITELISTED_IP,
            "X-Real-IP": WHITELISTED_IP,
            "Content-Type": "application/json"
        }
        config_data = {
            "openrouter_model": "google/gemini-2.5-flash"
        }
        
        response = requests.post(f"{API_BASE}/config", json=config_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Update Config - IP Whitelisted", "PASS", "Configuration updated successfully")
                return True
            else:
                log_test("Update Config - IP Whitelisted", "FAIL", f"Update failed: {data}")
                return False
        else:
            log_test("Update Config - IP Whitelisted", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Update Config - IP Whitelisted", "FAIL", f"Exception: {str(e)}")
        return False

def test_contact_form():
    """Test contact form submission (public endpoint)"""
    try:
        contact_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@example.com",
            "phone": "+1234567890",
            "subject": "TOEFL Course Inquiry",
            "message": "I am interested in your TOEFL preparation courses. Could you please provide more information about the curriculum and schedule?",
            "program": "TOEFL iBT"
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

def run_all_tests():
    """Run all IP whitelisting backend tests"""
    print("🚀 Starting Express English Hub Backend API Tests - IP Whitelisting System")
    print("=" * 70)
    
    # Basic connectivity tests
    test_health_check()
    test_root_endpoint()
    
    # IP Whitelisting tests
    test_admin_access_endpoint()
    test_admin_access_non_whitelisted()
    test_old_auth_endpoints_removed()
    
    # Article management tests with IP whitelisting
    test_get_articles()
    test_generate_article_without_whitelist()
    test_generate_article_with_ip_whitelist()
    test_delete_article_without_whitelist()
    test_delete_article_with_ip_whitelist()
    
    # Configuration tests with IP whitelisting
    test_get_config_without_whitelist()
    test_get_config_with_ip_whitelist()
    test_update_config_with_ip_whitelist()
    
    # Contact form tests (public endpoints)
    test_contact_form()
    test_contact_form_validation()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
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
        with open("backend_test_ip_whitelist_results.json", "w") as f:
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
        
        print(f"\n📄 Detailed results saved to: /app/backend_test_ip_whitelist_results.json")
        
        # Exit with appropriate code
        exit(0 if failed == 0 else 1)
        
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n💥 Test execution failed: {str(e)}")
        exit(1)