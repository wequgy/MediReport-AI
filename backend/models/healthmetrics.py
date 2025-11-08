from . import db

class healthmetrics(db.Model):
    __tablename__ = "healthmetrics"

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("reports.id"), nullable=False)
    test_name = db.Column(db.String(100))
    value = db.Column(db.String(50))
    unit = db.Column(db.String(20))
    range = db.Column(db.String(50))
    status = db.Column(db.String(20))
    remarks = db.Column(db.Text)
    possible_causes = db.Column(db.Text)
    related_factors = db.Column(db.Text)

    report = db.relationship("reports", back_populates="metrics")