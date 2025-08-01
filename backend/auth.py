from flask import Flask, request, jsonify, session
import hmac
import secrets
import time
import logging
from functools import wraps
from collections import defaultdict

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

# Admin password hash
ADMIN_PASSWORD = 'kiyotaka'  # Should be stored as environment variable in production
login_attempts = defaultdict(list)

def rate_limit(max_attempts=3, window=300):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            now = time.time()

            # Purge old attempts
            login_attempts[client_ip] = [t for t in login_attempts[client_ip] if now - t < window]

            if len(login_attempts[client_ip]) >= max_attempts:
                logging.warning(f"Rate limit exceeded for IP: {client_ip}")
                return jsonify({"success": False, "error": "Too many attempts"}), 429

            return f(*args, **kwargs)
        return wrapped
    return decorator

@app.route('/api/login', methods=['POST', 'OPTIONS'])
@rate_limit()
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.get_json()
    password = data.get('password', '')
    
    try:
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        
        # Secure password comparison
        if not hmac.compare_digest(password.encode(), ADMIN_PASSWORD.encode()):
            login_attempts[client_ip].append(time.time())
            logging.warning(f"Failed login attempt from IP: {client_ip}")
            time.sleep(1)  # Add delay to mitigate brute force
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Password correct - create admin session
        session_token = secrets.token_hex(32)
        
        # Store session data
        session['admin_logged_in'] = True
        # No username tracking as per requirements
        session['session_token'] = session_token
        session['login_time'] = int(time.time())
        
        logging.info(f"Admin login successful from IP: {client_ip} at {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': session_token,
            # No username in response
            'login_time': time.strftime('%Y-%m-%d %H:%M:%S')
        })
        
    except Exception as e:
        logging.error(f"Authentication error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Authentication service temporarily unavailable'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)