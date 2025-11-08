from . import db

class doctors(db.Model):
    __tablename__ = "doctors"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True)
    specialization = db.Column(db.String(120))
    verified = db.Column(db.Boolean, default=False)
