from flask import Blueprint
from flask_restful import Api, abort, reqparse, request
from server import app, logger, socketio
from flask.json import jsonify
import json
import requests
from enum import Enum
from github import Github, GithubException

from server.api.coreApi import ApiResource, Scope

from server.tasks import add, copyAppToNewRepo as copyAppToNewRepoAsync

message_api = Api(Blueprint('message_api', __name__))



class Event_Types(Enum):
    QUEUED = 'QUEUED'
    IN_PROGRESS = 'IN_PROGRESS'
    STATE_UPDATE = 'STATUS_UPDATE'
    COMPLETED = 'COMPLETED'


@message_api.resource('/emit')
class Emit_Message(ApiResource):

    def post(self):
        event_type = self.event_type.value
        toEmit = {
            "namespace": self.namespace,
            "eventType": event_type,
            "message": self.message,
        }

        socketio.emit(event_type, toEmit, namespace=self.namespace)

        return toEmit


    def __init__(self):
        self.scope = Scope.SERVICE
        super(Emit_Message, self).__init__()

        self.add_argument('namespace', type=str, required=True, location='json')
        self.namespace = self.args.get('namespace')

        self.add_argument('eventType', type=str, required=True, location='json')
        self.event_type = Event_Types[self.args.get('eventType')]

        self.add_argument('message', type=str, required=True, location='json')
        self.message = self.args.get('message')
