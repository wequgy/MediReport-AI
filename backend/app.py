from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from models import db, users, reports, healthmetrics, doctors

app = Flask(__name__)
app.secret_key = 'secret'

#Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Project1.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

#CORS setup
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

@app.after_request
def after_request(response):
    origin = request.headers.get("Origin")
    if origin in [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ]:
        response.headers.add("Access-Control-Allow-Origin", origin)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

#Google Login Route
@app.route("/api/google-login", methods=["POST"])
def google_login():
    data = request.get_json()
    access_token = data.get("token")

    if not access_token:
        return jsonify({"success": False, "message": "Missing access token"}), 400

    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {"access_token": access_token}
    userinfo_response = requests.get(userinfo_url, params=params)

    if userinfo_response.status_code != 200:
        return jsonify({"success": False, "message": "Invalid Google token"}), 400

    user_info = userinfo_response.json()
    email = user_info.get("email")
    name = user_info.get("name")

    if not email:
        return jsonify({"success": False, "message": "Email not provided by Google"}), 400

    user = users.query.filter_by(email=email).first()
    if not user:
        user = users(full_name=name, email=email, google_auth=True)
        db.session.add(user)
        db.session.commit()

    return jsonify({
        "success": True,
        "message": "Google login successful",
        "user": {"id": user.id, "name": user.full_name}
    }), 200

#Normal login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users.query.filter_by(email=email).first()
    if not user or user.password != password:
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": {"id": user.id, "name": user.full_name}
    }), 200

#Signup
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if users.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already registered."}), 400

    new_user = users(full_name=full_name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Account created successfully!",
        "user": {"id": new_user.id, "name": new_user.full_name}
    }), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
