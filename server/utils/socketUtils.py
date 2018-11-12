from flask import url_for
from server import socketio, logger, app
import requests

def sendMessage(event_type, message, namespace=None, room=None):
    socketio.emit(event_type, message, namespace=namespace, room=room)
    return


def postMessage(eventType, message, namespace=None, room=None):

    data = {
        'eventType': eventType,
        'namespace': namespace,
        'room': room,
        'message': message,
    }
    headers = {
        'Authorization': 'Bearer {}'.format(app.config.get('SERVICE_TOKEN')),
        'Content-Type': 'application/json'
    }
    with app.app_context():
        url = 'http://localhost:8000/api/message/emit'#url_for('message_api.emit')
        resp = requests.post(url, json=data, headers=headers)
        return resp
