from flask import request, jsonify
from pprint import pprint
from . import web as app
from .. import mongo

@app.route('/dl')
def index():
    start_at = request.args.get('startTime')
    end_at = request.args.get('endTime')
    number = request.args.get('number')

    if start_at == None:
        return jsonify({ 'message': 'Requires parameters: `startTime`' })
    if end_at == None:
        return jsonify({ 'message': 'Requires parameters: `endTime`' })
    if number == None:
        return jsonify({ 'message': 'Requires parameters: `number`' })

    _where = { 'number': number, 'ts': { '$gte': start_at, '$lte': end_at } }

    # for item in mongo.db.devmoniters.find().sort('_id', -1).limit(12):
    #     pprint(item['_id'])

    return jsonify({})
