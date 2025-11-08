from . import db

class healthmetrics(db.Model):
    __tablename__ = "healthmetrics"
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("reports.id"), nullable=False)
    parameter_name = db.Column(db.String(100))
    value = db.Column(db.Float)
    unit = db.Column(db.String(20))
    reference_range = db.Column(db.String(50))

    report = db.relationship("reports", back_populates="metrics")
