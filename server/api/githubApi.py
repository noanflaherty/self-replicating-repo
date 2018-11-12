from flask import Blueprint, session
from flask_restful import Api, abort, reqparse, request
from server import app, logger
from flask.json import jsonify
import json
import requests
from github import Github, GithubException

from server.api.coreApi import ApiResource, Scope

from server.tasks import add, copyAppToNewRepo as copyAppToNewRepoAsync, timer

github_api = Api(Blueprint('github_api', __name__))

@github_api.resource('/authenticate')
class Fetch_Github_Auth_Token(ApiResource):

    def post(self):
        super(Fetch_Github_Auth_Token, self).post()
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
        self.scope = Scope.OPEN
        super(Fetch_Github_Auth_Token, self).__init__()

        self.add_argument('code', type=str, required=True, location='args')
        self.code = self.args.get('code')



@github_api.resource('/copy-app-to-repo')
class Copy_App_To_New_Repo(ApiResource):

    def post(self):
        super(Copy_App_To_New_Repo, self).post()

        task = copyAppToNewRepoAsync.delay(self.token, self.repo_name, request.path)

        return jsonify({'id': task.id})


    def __init__(self):
        self.scope = Scope.MEMBER
        super(Copy_App_To_New_Repo, self).__init__()

        self.add_argument('repoName', type=str, required=True, location='json')
        self.repo_name = self.args.get('repoName')




@github_api.resource('/add')
class Add(ApiResource):

    def post(self):
        super(Add, self).post()

        add.delay(self.x, self.y)

        return {}

    def __init__(self):
        self.scope = Scope.MEMBER
        super(Add, self).__init__()

        self.add_argument('x', type=int, required=True, location='args')
        self.add_argument('y', type=int, required=True, location='args')

        self.x = self.args.get('x')
        self.y = self.args.get('y')


@github_api.resource('/timer')
class Timer(ApiResource):

    def post(self):
        super(Timer, self).post()

        task = timer.delay(self.n)

        return jsonify({'taskId': task.id})

    def __init__(self):
        self.scope = Scope.SERVICE
        super(Timer, self).__init__()

        self.add_argument('n', type=int, required=True, location='args')

        self.n = self.args.get('n')




def handleGithubError(error, data={}):
    status = error.args[0]
    errorData = error.args[1]

    resp = {
        'data': data,
        'error': errorData,
    }

    logger.debug('Received GitHub Error with Status {status}. Error: {errorData}'.format(status=status, errorData=errorData))
    return resp, status
