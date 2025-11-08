from datetime import datetime
from . import db

class reports(db.Model):
    __tablename__ = "reports"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    patient_name = db.Column(db.String(100))
    patient_age = db.Column(db.Integer)
    patient_sex = db.Column(db.String(10))
    sample_type = db.Column(db.String(50))
    report_date = db.Column(db.String(50))
    summary = db.Column(db.Text)
    file_path = db.Column(db.String(200))
    
    user = db.relationship("users", back_populates="reports")
    metrics = db.relationship("healthmetrics", back_populates="report", cascade="all, delete-orphan")