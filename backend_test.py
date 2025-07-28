#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Express English Hub TOEFL Platform
Tests all PHP backend APIs running on localhost:8080
"""

import requests
import json
import time
import os
import sys
from datetime import datetime

class TOEFLBackendTester:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'TOEFL-Backend-Tester/1.0'
        })
        self.test_results = []
        self.admin_credentials = {
            'username': 'Reze',
            'password': 'Denji'
        }
        
    def log_test(self, test_name, status, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'status': status,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.test_results.append(result)
        
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {message}")
        if details and status != "PASS":
            print(f"   Details: {details}")
    
    def test_basic_php_functionality(self):
        """Test basic PHP functionality endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/test-php.php")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success' and 'php_version' in data:
                    self.log_test(
                        "Basic PHP Functionality", 
                        "PASS", 
                        f"PHP {data['php_version']} working correctly",
                        {'response': data}
                    )
                    return True
                else:
                    self.log_test(
                        "Basic PHP Functionality", 
                        "FAIL", 
                        "Invalid response format",
                        {'response': data}
                    )
            else:
                self.log_test(
                    "Basic PHP Functionality", 
                    "FAIL", 
                    f"HTTP {response.status_code}",
                    {'response_text': response.text}
                )
        except Exception as e:
            self.log_test(
                "Basic PHP Functionality", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_articles_listing(self):
        """Test articles listing API"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles.php")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'articles' in data and 'count' in data:
                    self.log_test(
                        "Articles Listing", 
                        "PASS", 
                        f"Found {data['count']} articles",
                        {'article_count': data['count']}
                    )
                    return True
                else:
                    self.log_test(
                        "Articles Listing", 
                        "FAIL", 
                        "Invalid response format",
                        {'response': data}
                    )
            else:
                self.log_test(
                    "Articles Listing", 
                    "FAIL", 
                    f"HTTP {response.status_code}",
                    {'response_text': response.text}
                )
        except Exception as e:
            self.log_test(
                "Articles Listing", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_login_system(self):
        """Test admin login system"""
        try:
            # Test valid login
            login_data = self.admin_credentials
            response = self.session.post(
                f"{self.base_url}/api/login.php",
                data=json.dumps(login_data)
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'token' in data and 'username' in data:
                    self.log_test(
                        "Admin Login (Valid)", 
                        "PASS", 
                        f"Login successful for user {data['username']}",
                        {'token_length': len(data['token'])}
                    )
                    
                    # Test invalid login
                    invalid_data = {'username': 'wrong', 'password': 'wrong'}
                    response = self.session.post(
                        f"{self.base_url}/api/login.php",
                        data=json.dumps(invalid_data)
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        if not data.get('success') and 'error' in data:
                            self.log_test(
                                "Admin Login (Invalid)", 
                                "PASS", 
                                "Invalid credentials properly rejected"
                            )
                            return True
                        else:
                            self.log_test(
                                "Admin Login (Invalid)", 
                                "FAIL", 
                                "Invalid credentials not properly rejected",
                                {'response': data}
                            )
                    else:
                        self.log_test(
                            "Admin Login (Invalid)", 
                            "FAIL", 
                            f"HTTP {response.status_code} for invalid login"
                        )
                else:
                    self.log_test(
                        "Admin Login (Valid)", 
                        "FAIL", 
                        "Login failed or invalid response",
                        {'response': data}
                    )
            else:
                self.log_test(
                    "Admin Login (Valid)", 
                    "FAIL", 
                    f"HTTP {response.status_code}",
                    {'response_text': response.text}
                )
        except Exception as e:
            self.log_test(
                "Admin Login System", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_auth_check(self):
        """Test authentication verification"""
        try:
            # First login to establish session
            login_data = self.admin_credentials
            login_response = self.session.post(
                f"{self.base_url}/api/login.php",
                data=json.dumps(login_data)
            )
            
            if login_response.status_code == 200 and login_response.json().get('success'):
                # Test auth check with valid session
                response = self.session.get(f"{self.base_url}/api/auth-check.php")
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('authenticated'):
                        self.log_test(
                            "Auth Check (Authenticated)", 
                            "PASS", 
                            f"User {data.get('username')} authenticated",
                            {'login_time': data.get('login_time')}
                        )
                        
                        # Test logout
                        logout_response = self.session.post(f"{self.base_url}/api/auth-check.php")
                        if logout_response.status_code == 200:
                            logout_data = logout_response.json()
                            if logout_data.get('success'):
                                self.log_test(
                                    "Logout", 
                                    "PASS", 
                                    "Logout successful"
                                )
                                
                                # Test auth check after logout
                                auth_response = self.session.get(f"{self.base_url}/api/auth-check.php")
                                if auth_response.status_code == 200:
                                    auth_data = auth_response.json()
                                    if not auth_data.get('authenticated'):
                                        self.log_test(
                                            "Auth Check (Unauthenticated)", 
                                            "PASS", 
                                            "Unauthenticated state properly detected"
                                        )
                                        return True
                                    else:
                                        self.log_test(
                                            "Auth Check (Unauthenticated)", 
                                            "FAIL", 
                                            "Still authenticated after logout"
                                        )
                        return False
                    else:
                        self.log_test(
                            "Auth Check (Authenticated)", 
                            "FAIL", 
                            "Authentication not properly detected",
                            {'response': data}
                        )
                else:
                    self.log_test(
                        "Auth Check", 
                        "FAIL", 
                        f"HTTP {response.status_code}"
                    )
            else:
                self.log_test(
                    "Auth Check", 
                    "FAIL", 
                    "Could not establish authenticated session for testing"
                )
        except Exception as e:
            self.log_test(
                "Auth Check System", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_article_generation(self):
        """Test AI article generation"""
        try:
            # First login to establish session
            login_data = self.admin_credentials
            login_response = self.session.post(
                f"{self.base_url}/api/login.php",
                data=json.dumps(login_data)
            )
            
            if login_response.status_code == 200 and login_response.json().get('success'):
                # Test article generation
                generation_data = {
                    'keywords': 'TOEFL Reading Strategies',
                    'count': 1,
                    'language': 'en'
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/generate-article.php",
                    data=json.dumps(generation_data)
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'articles' in data and data.get('count', 0) > 0:
                        self.log_test(
                            "Article Generation", 
                            "PASS", 
                            f"Generated {data['count']} article(s)",
                            {'articles': data['articles']}
                        )
                        return True
                    else:
                        self.log_test(
                            "Article Generation", 
                            "FAIL", 
                            "Generation failed or invalid response",
                            {'response': data}
                        )
                elif response.status_code == 401:
                    self.log_test(
                        "Article Generation", 
                        "FAIL", 
                        "Authentication required but session should be valid"
                    )
                else:
                    self.log_test(
                        "Article Generation", 
                        "FAIL", 
                        f"HTTP {response.status_code}",
                        {'response_text': response.text}
                    )
            else:
                self.log_test(
                    "Article Generation", 
                    "FAIL", 
                    "Could not establish authenticated session"
                )
        except Exception as e:
            self.log_test(
                "Article Generation", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_article_deletion(self):
        """Test article deletion"""
        try:
            # First login
            login_data = self.admin_credentials
            login_response = self.session.post(
                f"{self.base_url}/api/login.php",
                data=json.dumps(login_data)
            )
            
            if login_response.status_code == 200 and login_response.json().get('success'):
                # Get list of articles first
                articles_response = self.session.get(f"{self.base_url}/api/articles.php")
                
                if articles_response.status_code == 200:
                    articles_data = articles_response.json()
                    if articles_data.get('success') and articles_data.get('count', 0) > 0:
                        # Try to delete the first article
                        first_article = articles_data['articles'][0]
                        filename = first_article['filename']
                        
                        delete_data = {'filename': filename}
                        response = self.session.post(
                            f"{self.base_url}/api/delete-article.php",
                            data=json.dumps(delete_data)
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            if data.get('success'):
                                self.log_test(
                                    "Article Deletion", 
                                    "PASS", 
                                    f"Successfully deleted {filename}"
                                )
                                return True
                            else:
                                self.log_test(
                                    "Article Deletion", 
                                    "FAIL", 
                                    f"Deletion failed: {data.get('error', 'Unknown error')}"
                                )
                        else:
                            self.log_test(
                                "Article Deletion", 
                                "FAIL", 
                                f"HTTP {response.status_code}"
                            )
                    else:
                        self.log_test(
                            "Article Deletion", 
                            "SKIP", 
                            "No articles available to delete"
                        )
                        return True  # Not a failure, just no articles to test with
                else:
                    self.log_test(
                        "Article Deletion", 
                        "FAIL", 
                        "Could not retrieve articles list"
                    )
            else:
                self.log_test(
                    "Article Deletion", 
                    "FAIL", 
                    "Could not establish authenticated session"
                )
        except Exception as e:
            self.log_test(
                "Article Deletion", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_contact_form(self):
        """Test contact form functionality"""
        try:
            contact_data = {
                'name': 'John Doe',
                'email': 'john.doe@example.com',
                'phone': '+1234567890',
                'subject': 'TOEFL Course Inquiry',
                'message': 'I am interested in your TOEFL preparation courses. Could you please provide more information about the curriculum and pricing?',
                'program': 'TOEFL ITP'
            }
            
            response = self.session.post(
                f"{self.base_url}/api/contact.php",
                data=json.dumps(contact_data)
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test(
                        "Contact Form", 
                        "PASS", 
                        "Contact form submitted successfully",
                        {'message': data.get('message')}
                    )
                    
                    # Test validation - missing required fields
                    invalid_data = {'name': 'Test'}  # Missing email and message
                    validation_response = self.session.post(
                        f"{self.base_url}/api/contact.php",
                        data=json.dumps(invalid_data)
                    )
                    
                    if validation_response.status_code == 200:
                        validation_data = validation_response.json()
                        if not validation_data.get('success') and 'error' in validation_data:
                            self.log_test(
                                "Contact Form Validation", 
                                "PASS", 
                                "Validation properly rejects incomplete data"
                            )
                            return True
                        else:
                            self.log_test(
                                "Contact Form Validation", 
                                "FAIL", 
                                "Validation should reject incomplete data"
                            )
                    return False
                else:
                    self.log_test(
                        "Contact Form", 
                        "FAIL", 
                        f"Submission failed: {data.get('error', 'Unknown error')}"
                    )
            else:
                self.log_test(
                    "Contact Form", 
                    "FAIL", 
                    f"HTTP {response.status_code}",
                    {'response_text': response.text}
                )
        except Exception as e:
            self.log_test(
                "Contact Form", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_seo_analytics(self):
        """Test SEO analytics functionality"""
        try:
            # First login
            login_data = self.admin_credentials
            login_response = self.session.post(
                f"{self.base_url}/api/login.php",
                data=json.dumps(login_data)
            )
            
            if login_response.status_code == 200 and login_response.json().get('success'):
                # Test GET request for dashboard data
                response = self.session.get(f"{self.base_url}/api/seo-analytics.php")
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'stats' in data:
                        self.log_test(
                            "SEO Analytics Dashboard", 
                            "PASS", 
                            "Dashboard data retrieved successfully",
                            {'stats': data['stats']}
                        )
                        
                        # Test content analysis
                        analysis_data = {
                            'action': 'analyze_content',
                            'content': '<html><head><title>TOEFL Test Preparation</title><meta name="description" content="Complete TOEFL preparation guide"></head><body><h1>TOEFL Preparation</h1><p>This is a comprehensive guide for TOEFL preparation.</p></body></html>'
                        }
                        
                        analysis_response = self.session.post(
                            f"{self.base_url}/api/seo-analytics.php",
                            data=json.dumps(analysis_data)
                        )
                        
                        if analysis_response.status_code == 200:
                            analysis_result = analysis_response.json()
                            if analysis_result.get('success') and 'analysis' in analysis_result:
                                self.log_test(
                                    "SEO Content Analysis", 
                                    "PASS", 
                                    f"Content analyzed with score: {analysis_result['analysis'].get('score', 'N/A')}"
                                )
                                return True
                            else:
                                self.log_test(
                                    "SEO Content Analysis", 
                                    "FAIL", 
                                    "Content analysis failed"
                                )
                        else:
                            self.log_test(
                                "SEO Content Analysis", 
                                "FAIL", 
                                f"HTTP {analysis_response.status_code}"
                            )
                    else:
                        self.log_test(
                            "SEO Analytics Dashboard", 
                            "FAIL", 
                            "Invalid dashboard response",
                            {'response': data}
                        )
                elif response.status_code == 401:
                    self.log_test(
                        "SEO Analytics", 
                        "FAIL", 
                        "Authentication required but session should be valid"
                    )
                else:
                    self.log_test(
                        "SEO Analytics", 
                        "FAIL", 
                        f"HTTP {response.status_code}"
                    )
            else:
                self.log_test(
                    "SEO Analytics", 
                    "FAIL", 
                    "Could not establish authenticated session"
                )
        except Exception as e:
            self.log_test(
                "SEO Analytics", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_plugin_manager(self):
        """Test plugin management functionality"""
        try:
            # First login
            login_data = self.admin_credentials
            login_response = self.session.post(
                f"{self.base_url}/api/login.php",
                data=json.dumps(login_data)
            )
            
            if login_response.status_code == 200 and login_response.json().get('success'):
                # Test GET request to list plugins
                response = self.session.get(f"{self.base_url}/api/plugin-manager.php")
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'plugins' in data:
                        self.log_test(
                            "Plugin Manager List", 
                            "PASS", 
                            f"Found {data.get('active_count', 0)} active plugins out of {len(data['plugins'])} total",
                            {'plugin_count': len(data['plugins'])}
                        )
                        return True
                    else:
                        self.log_test(
                            "Plugin Manager List", 
                            "FAIL", 
                            "Invalid plugin list response",
                            {'response': data}
                        )
                elif response.status_code == 401:
                    self.log_test(
                        "Plugin Manager", 
                        "FAIL", 
                        "Authentication required but session should be valid"
                    )
                else:
                    self.log_test(
                        "Plugin Manager", 
                        "FAIL", 
                        f"HTTP {response.status_code}"
                    )
            else:
                self.log_test(
                    "Plugin Manager", 
                    "FAIL", 
                    "Could not establish authenticated session"
                )
        except Exception as e:
            self.log_test(
                "Plugin Manager", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def test_sitemap_update(self):
        """Test sitemap generation and update"""
        try:
            response = self.session.get(f"{self.base_url}/api/update-sitemap.php")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test(
                        "Sitemap Update", 
                        "PASS", 
                        f"Sitemap updated with {data.get('total_urls', 0)} URLs",
                        {
                            'articles_count': data.get('articles_count', 0),
                            'total_urls': data.get('total_urls', 0)
                        }
                    )
                    return True
                else:
                    self.log_test(
                        "Sitemap Update", 
                        "FAIL", 
                        f"Update failed: {data.get('error', 'Unknown error')}"
                    )
            else:
                self.log_test(
                    "Sitemap Update", 
                    "FAIL", 
                    f"HTTP {response.status_code}",
                    {'response_text': response.text}
                )
        except Exception as e:
            self.log_test(
                "Sitemap Update", 
                "FAIL", 
                f"Request failed: {str(e)}"
            )
        return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Express English Hub Backend API Tests")
        print(f"📍 Testing backend at: {self.base_url}")
        print("=" * 60)
        
        tests = [
            ("Basic PHP Functionality", self.test_basic_php_functionality),
            ("Articles Listing", self.test_articles_listing),
            ("Admin Login System", self.test_login_system),
            ("Authentication Check", self.test_auth_check),
            ("Article Generation", self.test_article_generation),
            ("Article Deletion", self.test_article_deletion),
            ("Contact Form", self.test_contact_form),
            ("SEO Analytics", self.test_seo_analytics),
            ("Plugin Manager", self.test_plugin_manager),
            ("Sitemap Update", self.test_sitemap_update)
        ]
        
        passed = 0
        failed = 0
        skipped = 0
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running: {test_name}")
            try:
                result = test_func()
                if result:
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ {test_name}: EXCEPTION - {str(e)}")
                failed += 1
            
            time.sleep(0.5)  # Small delay between tests
        
        # Count skipped tests
        for result in self.test_results:
            if result['status'] == 'SKIP':
                skipped += 1
                failed -= 1  # Adjust failed count
        
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"⚠️  Skipped: {skipped}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%" if (passed+failed) > 0 else "N/A")
        
        # Detailed results
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            status_symbol = "✅" if result['status'] == "PASS" else "❌" if result['status'] == "FAIL" else "⚠️"
            print(f"{status_symbol} {result['test']}: {result['message']}")
        
        return passed, failed, skipped

def main():
    """Main test execution"""
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "http://localhost:8080"
    
    tester = TOEFLBackendTester(base_url)
    passed, failed, skipped = tester.run_all_tests()
    
    # Save results to file
    results_file = "/app/backend_test_results.json"
    with open(results_file, 'w') as f:
        json.dump({
            'summary': {
                'passed': passed,
                'failed': failed,
                'skipped': skipped,
                'total': passed + failed + skipped,
                'success_rate': (passed/(passed+failed)*100) if (passed+failed) > 0 else 0
            },
            'tests': tester.test_results,
            'timestamp': datetime.now().isoformat()
        }, f, indent=2)
    
    print(f"\n💾 Results saved to: {results_file}")
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()