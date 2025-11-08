from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .users import users
from .reports import reports
from .healthmetrics import healthmetrics
