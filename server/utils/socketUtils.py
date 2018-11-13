from flask import url_for
from server import socketio, logger, app
import requests

def emitEvent(event_type, data, namespace=None, room=None):
    socketio.emit(event_type, data, namespace=namespace, room=room)
    return


def postEvent(eventType, data, namespace=None, room=None):

    if not isinstance(data, dict):
        raise TypeError("Message data must be of type dict.")

    headers = {
        'Authorization': 'Bearer {}'.format(app.config.get('SERVICE_TOKEN')),
        'Content-Type': 'application/json'
    }

    emit = {
        'eventType': eventType,
        'data': data,
        'namespace': namespace,
        'room': room,
    }
    with app.test_request_context():
        url = url_for('message_api.emit_message', _external=True)

    resp = requests.post(url, json=emit, headers=headers)
    return resp
