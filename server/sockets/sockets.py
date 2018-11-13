from server import socketio, logger
from flask_socketio import join_room

@socketio.on('JOIN_ROOM')
def handle_message(room):
    logger.debug('Joining Room: ' + str(room))
    join_room(room)


@socketio.on('connect')
def on_connect():
    logger.debug('Client connected')


@socketio.on('disconnect')
def on_disconnect():
    logger.debug('Client disconnected')
