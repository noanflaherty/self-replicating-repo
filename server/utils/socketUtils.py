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

    url = 'http://localhost:8000/api/message/emit'#url_for('message_api.emit')
    resp = requests.post(url, json=emit, headers=headers)
    return resp
