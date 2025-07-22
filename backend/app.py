from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from datetime import timedelta


# SECRET KEY
# TODO: SAFE IN ENVIRONMENT VARIABLE
import secrets
secret_key = secrets.token_hex(32)  # 64-character hexadecimal string


app = Flask(__name__)
app.secret_key = secret_key  # Replace with actual key
app.config.update(
    PERMANENT_SESSION_LIFETIME= timedelta(minutes=30),
    SESSION_COOKIE_SECURE=False, # only with HTTPS
    SESSION_COOKIE_SAMESITE='Lax',  # Allows cross-origin cookies
    SESSION_COOKIE_HTTPONLY=False,
    SESSION_COOKIE_PATH='/',
)

CORS(app, resources={
    r"/*": {
        "origins": "*",
        # "origins": "http://localhost:5173",
        "methods": ["POST","GET" "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True 
    }
})

# Functions
# 
# 
# 


@app.after_request
def after_request(response):
    # Add CORS headers for every response
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'  # Replace with your client domain
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

@app.route('/check', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def check_answer():
    try:
        data = request.get_json()
        return jsonify({'Answer': data, 'Check': "check ok" })
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/getQuestion', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def getQuestion():
    return jsonify({'Question': 'This is my first question'})


if __name__ == "__main__":
    app.run(debug=True, port=5002)