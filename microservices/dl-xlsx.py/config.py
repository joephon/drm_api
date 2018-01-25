import os
from pprint import pprint

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    MONGO_HOST = os.environ.get('MONGODB_HOST')
    MONGO_USERNAME = os.environ.get('MONGODB_USERNAME')
    MONGO_PASSWORD = os.environ.get('MONGODB_PASSWORD')
    MONGO_DBNAME = os.environ.get('MONGODB_DATABASE')
    SECRET_KEY_BASE = os.environ.get('SECRET_KEY_BASE')

    @staticmethod
    def init_app(app):
        pass

class DevConfig(Config):
    DEBUG = True

class TestConfig(Config):
    DEBUG = False

class ProdConfig(Config):
    DEBUG = False

config = {
    'development': DevConfig,
    'test': TestConfig,
    'production': ProdConfig
}
