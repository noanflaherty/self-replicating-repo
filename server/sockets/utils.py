from flask import url_for
from server import socketio, logger, app
from server.api.errors import error_response
import requests

def emitEvent(event_type, data, namespace=None, room=None):
    socketio.emit(event_type, data, namespace=namespace, room=room)
    return
