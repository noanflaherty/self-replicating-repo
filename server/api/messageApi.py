from flask import Blueprint
from flask_restful import Api, abort, reqparse, request
from flask_socketio import join_room, leave_room
from server import app, logger, socketio
from flask.json import jsonify
import json
import requests
from enum import Enum
from github import Github, GithubException

from server.api.coreApi import ApiResource, Scope

from server.tasks import add, copyAppToNewRepo as copyAppToNewRepoAsync
from server.utils.socketUtils import emitEvent

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
        super(Emit_Message, self).post()

        logger.debug('Emitting {event_type} to {room}: {data}'.format(event_type=self.event_type.value, room=self.room, data=self.data))

        emitEvent(self.event_type.value, self.data, namespace=self.namespace, room=self.room)

        return


    def __init__(self):
        self.scope = Scope.SERVICE
        super(Emit_Message, self).__init__()

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
