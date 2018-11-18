from flask import Blueprint, url_for
from flask_restful import Api, abort, reqparse, request
from flask_socketio import join_room, leave_room
from server import app, logger, socketio
from flask.json import jsonify
import json
import requests
from enum import Enum
from github import Github, GithubException

from server.api.coreApi import ApiResource, Scope

from server.sockets.utils import emitEvent

message_api = Api(Blueprint('message_api', __name__))


class Event_Types(Enum):
    QUEUED = 'QUEUED'
    IN_PROGRESS = 'IN_PROGRESS'
    STATE_UPDATE = 'STATUS_UPDATE'
    COMPLETED = 'COMPLETED'
    FAILED = 'FAILED'


def getAllEventTypes():
    return list(map(lambda event: event.value, Event_Types))


@message_api.resource('/emit')
class Emit_Message(ApiResource):

    def post(self):
        super().post()

        self.add_argument('namespace', type=str, required=False, location='json')
        self.namespace = self.args.get('namespace')

        self.add_argument('eventType', type=str, required=True, location='json')
        try:
            self.event_type = Event_Types(self.args.get('eventType'))
        except ValueError as e:
            abort(400, message='Invalid eventType provided: {}. Valid event types include: {}'.format(self.args.get('eventType'), getAllEventTypes()))

        self.add_argument('room', type=str, required=False, location='json')
        self.room = self.args.get('room')

        self.add_argument('data', type=dict, required=True, location='json')
        self.data = self.args.get('data')


        logger.debug('Emitting {event_type} to {room}: {data}'.format(event_type=self.event_type.value, room=self.room, data=self.data))
        emitEvent(self.event_type.value, self.data, namespace=self.namespace, room=self.room)

        return


    def __init__(self):
        self.scope = Scope.SERVICE
        super().__init__()


# This is a help function to easily post to the above endpoint from internal services
def postEvent(eventType, data, namespace=None, room=None):

    if not isinstance(data, dict):
        return error_response(500, "Message data must be of type dict.")

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

    try:
        resp = requests.post(url, json=emit, headers=headers)
    except:
        logger.debug('Failed to post to url: {}'.format(url))
        abort(500)

    return resp
