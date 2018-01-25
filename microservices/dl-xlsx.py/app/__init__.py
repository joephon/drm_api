from flask import Flask
from flask_pymongo import PyMongo
from pprint import pprint
from config import config

mongo = PyMongo()

def create_app(flask_env):
    app = Flask(__name__)
    app.config.from_object(config[flask_env])
    config[flask_env].init_app(app)
    mongo.init_app(app)

    from .web import web as web_blueprint
    app.register_blueprint(web_blueprint)

    return app
