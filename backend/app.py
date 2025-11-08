from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from models import db, users, reports, healthmetrics, doctors
import os
import json
import re
from PIL import Image
from google.cloud import vision
from werkzeug.utils import secure_filename
import google.generativeai as genai
from json import loads

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "vision-key.json"

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
LOGS_FOLDER = os.path.join(BASE_DIR, "logs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(LOGS_FOLDER, exist_ok=True)

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

def safe_json_parse(text: str):
    """
    Try to fix and parse Gemini's JSON-like text safely.
    Removes code fences, trailing commas, etc.
    """
    cleaned = re.sub(r"```(?:json)?|```", "", text, flags=re.DOTALL).strip()
    # remove newlines before colons and stray commas
    cleaned = re.sub(r",(\s*[}\]])", r"\1", cleaned)
    # find the first { ... } block
    match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
    if not match:
        raise ValueError("No JSON object found")
    candidate = match.group(0)
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        # final fallback: try demjson / json5 if installed, else error
        import ast
        try:
            return ast.literal_eval(candidate)
        except Exception:
            raise

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

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    # --- Gemini model setup ---
    generation_config = genai.types.GenerationConfig(
        response_mime_type="application/json"
    )
    model = genai.GenerativeModel("models/gemini-2.5-flash", generation_config=generation_config)

    with open(filepath, "rb") as f:
        image_data = f.read()

    # --- Prompt ---
    prompt = """
You are an advanced medical report analysis AI.

Input: A scanned image or photo of a **medical report or blood test report**.
Your output must be **pure JSON only**, without markdown or commentary.

Strict output JSON structure:
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
      "range": "13-17",
      "status": "Low",
      "remarks": "Slightly below normal for an adult male"
    },
    {
      "test": "WBC Count",
      "value": "9000",
      "unit": "/µL",
      "range": "4000-11000",
      "status": "Normal"
    }
  ],
  "summary": "Mild anemia suspected; other values normal."
}
Return **only** the JSON object, nothing else.
"""

    # --- Gemini call ---
    response = model.generate_content(
        [prompt, {"mime_type": "image/jpeg", "data": image_data}]
    )
    raw_output = (response.text or "").strip()

    # --- Log output to console + file ---
    log_path = os.path.join(LOGS_FOLDER, "gemini_output.txt")
    with open(log_path, "w", encoding="utf-8") as log_file:
        log_file.write(raw_output if raw_output else "[EMPTY RESPONSE]")
    print("Gemini raw output preview:\n", raw_output[:400] or "[EMPTY RESPONSE]")
    print(f"Full Gemini output saved to: {log_path}")

    if not raw_output:
        return jsonify({"success": False, "message": "Gemini returned no output"}), 500

    # --- Parse JSON safely ---
    try:
        parsed_json = safe_json_parse(raw_output)
        return jsonify({"success": True, "data": parsed_json}), 200
    except Exception as e:
        print("JSON Parsing Error:", e)
        return jsonify({
            "success": False,
            "message": f"Invalid JSON from Gemini: {str(e)}",
            "raw_output": raw_output
        }), 500
    
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
