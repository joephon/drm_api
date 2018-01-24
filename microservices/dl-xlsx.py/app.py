from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_HOST'] = ''
app.config['MONGO_DBNAME'] = ''
app.config['MONGO_USERNAME'] = ''
app.config['MONGO_PASSWORD'] = ''

mongo = PyMongo(app)

@app.route("/")
def index():
    return "{}"

if __name__ == '__main__':
    app.run(debug=True)
