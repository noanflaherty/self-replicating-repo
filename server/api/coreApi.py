from flask import Blueprint
from flask_restful import Api, Resource, abort, reqparse, request
from server import app, logger
from flask.json import jsonify
from functools import wraps
import json
import requests
from enum import Enum


class Scope(Enum):
    OPEN = 'OPEN'
    MEMBER = 'MEMBER'
    SERVICE = 'SERVICE'
    SUPER_ADMIN = 'SUPER_ADMIN'


class ApiResource(Resource):
    def __init__(self):

        # First we must validate that a scope was provided
        self._validate_scope()

        # Parse required headers
        self.reqparse = reqparse.RequestParser()
        self.args = self.reqparse.parse_args()

        # Authenticate the request based on the scope provided
        (self.token, self.authenticated) = self._authenticate()

        super(ApiResource, self).__init__()

    def add_argument(self, name, required=False, type=None, location=None):
        self.reqparse.add_argument(name, required=required, type=type, location=location)
        self.args = self.reqparse.parse_args()

    def post(self):
        # Require that content body is of type 'application/json'
        self.add_argument('Content-Type', type=str, required=True, location='headers')
        self.content_type = self.args.get('Content-Type')
        self._validate_content()


    def _validate_scope(self):
        try:
            if not isinstance(self.scope, Scope):
                raise TypeError('Provided scope must be of type Scope (enum).')
        except AttributeError as e:
            raise TypeError('Must define a valid scope as a property of the class. For example: `self.scope = Scope.MEMBER`')


    def _validate_content(self):
        if self.content_type != 'application/json':
            abort(406, message='Content-Type header must equal \'application/json\'')

        return True


    def _authenticate_service(self, token):
        service_token = app.config.get('SERVICE_TOKEN')

        if token != service_token:
            abort(401, message='Unauthorized. Invalid service token.')

        return True


    def _authenticate_member(self, token):
        if token is None:
            abort(401, message='Unauthorized. No Bearer token provided.')

        return True


    def _authenticate(self):

        if self.scope == Scope.OPEN:
            return (None, True)

        self.add_argument('Authorization', type=str, required=True, location='headers')

        try:
            token = self.args.get('Authorization').split('Bearer ')[1]
        except IndexError:
            abort(403, message='Forbidden. Missing "Bearer " in Authorization header value.')

        authenticated = False

        if self.scope == Scope.MEMBER:
            authenticated = self._authenticate_member(token)
        elif self.scope == Scope.SERVICE:
            authenticated = self._authenticate_service(token)
        else:
            abort(403, message='Forbidden. No known scope.')

        return (token, authenticated)
