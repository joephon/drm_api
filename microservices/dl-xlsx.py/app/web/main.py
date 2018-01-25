import jwt
import arrow
from flask import request, make_response, jsonify, send_from_directory, current_app
from pprint import pprint
from . import web as app
from .. import mongo
from ..utils import generate_xlsx

@app.before_request
def jwt_required():
    token = request.args.get('token')

    try:
        jwt.decode(token, current_app.config['SECRET_KEY_BASE'])
    except jwt.exceptions.DecodeError:
        return jsonify({ 'message': 'Requires authentication' }), 401

@app.route('/dl')
def send_xlsx_file():
    start_at = request.args.get('startTime')
    end_at = request.args.get('endTime')
    number = request.args.get('number')

    if start_at == None:
        return jsonify({ 'message': 'Requires parameters: `startTime`' })
    if end_at == None:
        return jsonify({ 'message': 'Requires parameters: `endTime`' })
    if number == None:
        return jsonify({ 'message': 'Requires parameters: `number`' })

    pprint("MAX_RESULTS_COUNT: {}".format(current_app.config['MAX_RESULTS_COUNT']))
    pprint("devmoniters.count: {}".format(mongo.db.devmoniters.count()))

    _where = { 'number': number, 'ts': { '$gte': start_at, '$lte': end_at } }
    _items = mongo.db.devmoniters.find().sort('_id', -1).limit(current_app.config['MAX_RESULTS_COUNT'])

    generate_xlsx(_items)
    filename = "{0}-{1}-{2}-{3}.xlsx".format(number, start_at, end_at, arrow.utcnow().timestamp)

    response = make_response(send_from_directory('../cache', 'dl.xlsx'))
    response.headers['Content-Disposition'] = "attachment; filename=\"{}\"".format(filename)

    return response
