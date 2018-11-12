from server import socketio, logger
from flask_socketio import join_room
from flask import session

@socketio.on('my event', namespace='/timer')
def handle_message(message):
    logger.debug('received message: ' + str(message))


@socketio.on('connect', namespace='/timer')
def on_connect():
    logger.debug('Client connected')


@socketio.on('disconnect', namespace='/timer')
def on_disconnect():
    print('Client disconnected')
