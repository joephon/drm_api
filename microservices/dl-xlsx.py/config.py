import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY_BASE = os.environ.get('SECRET_KEY_BASE')

    @staticmethod
    def init_app(app):
        pass

class DevConfig(Config):
    DEBUG = True

class TestConfig(Config):

class ProdConfig(Config):

config = {
    'development': DevConfig,
    'test': TestConfig,
    'production': ProdConfig
}
