from flask import Flask, render_template, request, redirect, url_for, session, flash
from models import db, users, parking_lots, parking_spots, reserve_spots  # Import the db, users, and parking_lots models
from sqlalchemy import func  
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'secret' 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Project1.db'
db.init_app(app)
app.app_context().push()