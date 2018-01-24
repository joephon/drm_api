from flask import Flask
from flask_pymongo import PyMongo
from config import config

def create_app(flask_env):
    app = Flask(__name__)
    app.config.from_object(config[flask_env])
    config[flask_env].init_app(app)

    return app

# app.config['MONGO_HOST'] = ''
# app.config['MONGO_DBNAME'] = ''
# app.config['MONGO_USERNAME'] = ''
# app.config['MONGO_PASSWORD'] = ''
# mongo = PyMongo(app)
#
# @app.route("/")
# def index():
#     return "{}"
#
# def server():
#     return app
