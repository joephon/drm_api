from flask_script import Manager
from .server import server

manager = Manager(server)

if __name__ == '__main__':
    manager.run()
