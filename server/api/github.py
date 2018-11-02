from flask import Blueprint
from flask_restful import Api, Resource, abort, reqparse, request
from server import app, logger
import json
import requests

github_api = Api(Blueprint('github_api', __name__))

@github_api.resource('/authenticate')
class Fetch_Github_Auth_Token(Resource):

    def post(self):

        print self.code
        print app.config.get('GITHUB_REDIRECT_URI')

        token_url = 'https://github.com/login/oauth/access_token'

        data = {
            'client_id': app.config.get('GITHUB_CLIENT_ID'),
            'client_secret': app.config.get('GITHUB_CLIENT_SECRET'),
            'code': self.code,
        }
        headers = {
            'Accept': 'application/json'
        }

        resp = requests.post(token_url, data=data, headers=headers)

        return resp.json()

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('code', type=str, required=True, location='args')

        self.args = self.reqparse.parse_args()
        self.code = self.args.get('code')

        super(Fetch_Github_Auth_Token, self).__init__()
