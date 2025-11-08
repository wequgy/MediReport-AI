from datetime import datetime
from . import db

class reports(db.Model):
    __tablename__ = "reports"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    ocr_text = db.Column(db.Text)      
    ai_summary = db.Column(db.Text)     
    analyzed = db.Column(db.Boolean, default=False)
