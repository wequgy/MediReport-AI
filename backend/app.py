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
    cleaned = re.sub(r",(\s*[}\]])", r"\1", cleaned)  # remove stray commas
    match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
    if not match:
        raise ValueError("No JSON object found")
    candidate = match.group(0)
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        import ast
        return ast.literal_eval(candidate)

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

    # Save uploaded file
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    # --- Gemini setup ---
    generation_config = genai.types.GenerationConfig(
        response_mime_type="application/json"
    )
    model = genai.GenerativeModel(
        "models/gemini-2.5-flash", generation_config=generation_config
    )

    with open(filepath, "rb") as f:
        image_data = f.read()

    # --- Enhanced Prompt ---
    prompt = """
You are an advanced AI assistant specialized in analyzing **medical or blood test reports**.

Your goal is to:
1. Extract key patient details (Name, Age, Sex, Sample Type, Report Date).
2. Extract and interpret all **lab test parameters** found in the report.
3. For each test, determine:
   - "status": whether the value is Low, Normal, or High compared to standard clinical reference ranges (adjusted for sex and age).
   - "remarks": a short clinical interpretation.
   - "possible_causes": a brief explanation of what could cause the abnormality (if any).
   - "related_factors": other body metrics that could influence this test result.

Your response must be **pure valid JSON only**. Do not include Markdown or extra text.

Strict JSON Output Format:
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
      "remarks": "Slightly below normal for an adult male.",
      "possible_causes": "Iron deficiency, chronic disease, or recent blood loss.",
      "related_factors": "RBC count, MCV, and Hematocrit levels."
    }
  ],
  "summary": "Mild anemia suspected due to low hemoglobin. Recommend further tests or doctor consultation."
}

Only return valid JSON with this structure.
"""

    # --- Gemini call ---
    response = model.generate_content(
        [prompt, {"mime_type": "image/jpeg", "data": image_data}]
    )
    raw_output = (response.text or "").strip()

    # Log output
    print("\n🔹 Gemini raw output preview:\n", raw_output[:400] or "[EMPTY RESPONSE]")

    if not raw_output:
        return jsonify({"success": False, "message": "Gemini returned no output"}), 500

    # --- Parse Gemini response safely ---
    try:
        parsed_json = safe_json_parse(raw_output)
    except Exception as e:
        print("JSON Parsing Error:", e)
        return jsonify({
            "success": False,
            "message": f"Invalid JSON from Gemini: {str(e)}",
            "raw_output": raw_output
        }), 500

    # ✅ Extract patient data
    patient = parsed_json.get("patient", {})
    tests = parsed_json.get("tests", [])
    summary = parsed_json.get("summary", "")

    # --- DB Insertion ---
    try:
        user_id = int(request.form.get("user_id", 1))  

        # Create new report record
        new_report = reports(
            user_id=user_id,
            patient_name=patient.get("name"),
            patient_age=patient.get("age"),
            patient_sex=patient.get("sex"),
            sample_type=patient.get("sample_type"),
            report_date=patient.get("report_date"),
            summary=summary,
            file_path=filepath,
        )

        db.session.add(new_report)
        db.session.commit()  # generate report.id

        # Add each test as a healthmetric
        for t in tests:
            metric = healthmetrics(
                report_id=new_report.id,
                test_name=t.get("test"),
                value=t.get("value"),
                unit=t.get("unit"),
                range=t.get("range"),
                status=t.get("status"),
                remarks=t.get("remarks"),
                possible_causes=t.get("possible_causes"),
                related_factors=t.get("related_factors"),
            )
            db.session.add(metric)

        db.session.commit()

        print(f"Report saved: ID {new_report.id}, with {len(tests)} metrics")

        return jsonify({
            "success": True,
            "message": "Report analyzed and stored successfully.",
            "report_id": new_report.id,
            "data": parsed_json
        }), 200

    except Exception as db_error:
        db.session.rollback()
        print("Database Error:", db_error)
        return jsonify({"success": False, "message": str(db_error)}), 500

@app.route("/api/latest-report/<int:user_id>", methods=["GET"])
def latest_report(user_id):
    try:
        # Fetch most recent report for this user
        latest = (
            reports.query.filter_by(user_id=user_id)
            .order_by(reports.id.desc())
            .first()
        )

        if not latest:
            return jsonify({"success": False, "message": "No reports found"}), 404

        # Fetch related health metrics
        metrics = healthmetrics.query.filter_by(report_id=latest.id).all()

        metrics_data = [
            {
                "test": m.test_name,
                "value": m.value,
                "unit": m.unit,
                "range": m.range,
                "status": m.status,
                "remarks": m.remarks,
                "possible_causes": m.possible_causes,
                "related_factors": m.related_factors,
            }
            for m in metrics
        ]

        report_data = {
            "patient": {
                "name": latest.patient_name,
                "age": latest.patient_age,
                "sex": latest.patient_sex,
                "sample_type": latest.sample_type,
                "report_date": latest.report_date,
            },
            "tests": metrics_data,
            "summary": latest.summary,
        }

        return jsonify({"success": True, "data": report_data}), 200

    except Exception as e:
        print("Error fetching latest report:", e)
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/api/report-history/<int:user_id>", methods=["GET"])
def report_history(user_id):
    try:
        all_reports = (
            reports.query.filter_by(user_id=user_id)
            .order_by(reports.id.desc())
            .all()
        )


        if not all_reports:
            return jsonify({"success": False, "message": "No reports found"}), 404

        report_list = []
        for r in all_reports:
            metrics = healthmetrics.query.filter_by(report_id=r.id).all()

            # ✅ safer abnormal check
            has_abnormal = any((m.status or "").lower() != "normal" for m in metrics)

            report_list.append({
                "id": r.id,
                "date": r.report_date or str(r.upload_date.date()),
                "summary": (r.summary[:120] + "...") if r.summary and len(r.summary) > 120 else r.summary,
                "status": "attention" if has_abnormal else "normal",
                "tests": [
                    {"name": m.test_name, "status": m.status}
                    for m in metrics
                ]
            })

        return jsonify({"success": True, "data": report_list}), 200

    except Exception as e:
        print("Error fetching report history:", e)
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/api/report-details/<int:report_id>", methods=["GET"])
def report_details(report_id):
    report = reports.query.get(report_id)
    if not report:
        return jsonify({"success": False, "message": "Report not found"}), 404

    metrics = healthmetrics.query.filter_by(report_id=report.id).all()

    metrics_data = [
        {
            "test": m.test_name,
            "value": m.value,
            "unit": m.unit,
            "range": m.range,
            "status": m.status,
            "remarks": m.remarks,
            "possible_causes": m.possible_causes,
            "related_factors": m.related_factors,
        }
        for m in metrics
    ]

    data = {
        "patient": {
            "name": report.patient_name,
            "age": report.patient_age,
            "sex": report.patient_sex,
            "sample_type": report.sample_type,
            "report_date": report.report_date,
        },
        "tests": metrics_data,
        "summary": report.summary,
    }

    return jsonify({"success": True, "data": data}), 200

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

@app.route("/api/nearby-hospitals-osm")
def nearby_hospitals():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)
    if not lat or not lon:
        return jsonify({"error": "Missing lat/lon"}), 400

    # Rough bounding box around the user
    delta = 0.05  # ~5km radius
    bbox = f"{lat - delta},{lon - delta},{lat + delta},{lon + delta}"
    overpass_url = (
        f"https://overpass-api.de/api/interpreter?"
        f"data=[out:json];node['amenity'='hospital']({bbox});out;"
    )

    try:
        res = requests.get(overpass_url)
        data = res.json()
        hospitals = []
        for el in data.get("elements", []):
            name = el.get("tags", {}).get("name", "Unnamed Hospital")
            hospitals.append({"name": name, "lat": el["lat"], "lon": el["lon"]})
        return jsonify({"hospitals": hospitals})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
