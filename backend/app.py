from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from models import db, users, reports, healthmetrics, doctors
import os
from PIL import Image
from google.cloud import vision
from werkzeug.utils import secure_filename
import google.generativeai as genai

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "vision-key.json"

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.secret_key = "secret"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

genai.configure(api_key="AIzaSyDwOi80CqX84IP_zdUNMCVGnPhGOQkT_P8")

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

@app.route("/api/upload-report", methods=["POST"])
def upload_report():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "message": "Empty filename"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    model = genai.GenerativeModel("models/gemini-2.5-flash")

    with open(filepath, "rb") as f:
        image_data = f.read()

    prompt = """
You are an advanced medical report analysis AI.

Input: A scanned image or photo of a **medical report or blood test report**.
Task:
1. **Extract all available patient details**, such as:
   - Full name
   - Age
   - Sex
   - Sample type (e.g., blood, urine)
   - Collection/report date

2. **Extract all lab test parameters** shown in the report, including:
   - Test name (e.g., Hemoglobin, WBC Count, Cholesterol, etc.)
   - Measured value
   - Unit (e.g., g/dL, /µL, mg/dL)
   - Reference range (if printed)
   - Instrument name if available

3. **Interpret each test result** relative to the reference range and the patient’s age and sex.
   - Mark each test as `"status": "Low"`, `"Normal"`, or `"High"`.
   - If no range is given, estimate based on standard clinical norms for the patient’s profile.

4. **Return the result ONLY in the following strict JSON format**:
{
  "patient": {
    "name": "John Doe",
    "age": 21,
    "sex": "Male",
    "sample_type": "Blood",
    "report_date": "2025-11-07"
  },
  "tests": [
    {
      "test": "Hemoglobin",
      "value": "12.5",
      "unit": "g/dL",
      "range": "13–17",
      "status": "Low",
      "remarks": "Slightly below normal for an adult male"
    },
    {
      "test": "WBC Count",
      "value": "9000",
      "unit": "/µL",
      "range": "4000–11000",
      "status": "Normal"
    },
    {
      "test": "Platelet Count",
      "value": "150000",
      "unit": "/µL",
      "range": "180000–410000",
      "status": "Low"
    }
  ],
  "summary": "Mild anemia suspected due to low hemoglobin; other parameters are normal."
}

Important:
- Output **only** valid JSON. No text or commentary outside the JSON.
- Assume clinical interpretation should follow WHO and standard lab guidelines.
- Be accurate and concise.
"""

    response = model.generate_content([prompt, {"mime_type": "image/jpeg", "data": image_data}])
    return jsonify({"success": True, "analysis": response.text})

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
