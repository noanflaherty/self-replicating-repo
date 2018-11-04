from flask import Blueprint
from flask_restful import Api, Resource, abort, reqparse, request
from server import app, logger
from flask.json import jsonify
import json
import requests
from github import Github, GithubException

from server.utils.utils import getAllFilesWPathsInDirectory

DEFAULT_DIRS_TO_AVOID = set(['./.git', './env', './node_modules', './server/static/javascript', './.profile.d', './.heroku'])
DEFAULT_EXTENSIONS_TO_AVOID = set(['pyc', 'log', 'python_history'])

github_api = Api(Blueprint('github_api', __name__))

@github_api.resource('/authenticate')
class Fetch_Github_Auth_Token(Resource):

    def post(self):

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


@github_api.resource('/copy-app-to-repo')
class Copy_App_To_New_Repo(Resource):

    def post(self):

        repo_name = self.repo_name

        g = Github(self.token)

        # Since creating a repo happens on the user obejct, we must fetch the user first.
        user = g.get_user()

        # Try to create the repo. Creation will fail if a repo has already been created with that name.
        try:
            print('Trying to create new repo with name: {}'.format(repo_name))
            repo = user.create_repo(repo_name)
        # If we fail to create a repo, we check to see if it was because there was already one with that name
        except GithubException as repo_creation_error:
            data = {
                'repoName': repo_name,
            }
            return handleGithubError(repo_creation_error, data=data)

        # If we successfully created the repo, then we can prep all files in this app to add to the repo.
        files = getAllFilesWPathsInDirectory('.', dirsToAvoid=DEFAULT_DIRS_TO_AVOID, extensionsToAvoid=DEFAULT_EXTENSIONS_TO_AVOID)
        files_added_successfully = []
        files_failed = []

        for i, file_path in enumerate(files):

            # Try to read the file's content.
            try:
                with open(file_path, 'rb') as file:
                    file_content = file.read()
            except IOError as e:
                files_failed.append(file_path_formatted)
                continue

            file_path_formatted = file_path[2:]
            commit_message = 'Committing file {file_num} of {num_files}: {file_path}'.format(file_num=i+1, num_files=len(files), file_path=file_path_formatted)

            print(commit_message)

            try:
                # Ideally Github would allow us to add our files in batches, rather than one at a time,
                # so that we can reduce the number of API calls required. However, based on this
                # dicsussion, it does not appear to be possible. https://github.com/isaacs/github/issues/199

                repo.create_file(file_path_formatted, commit_message, file_content)
                files_added_successfully.append(file_path_formatted)
            except GithubException as e:
                errorMessage = e.args[1].get('message')
                files_failed.append(file_path_formatted)

        results = {
            'repoName': repo_name,
            'successfullyAdded':  files_added_successfully,
            'failed': files_failed,
        }

        return results


    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('token', required=True, location='json')
        self.reqparse.add_argument('repoName', required=True, location='json')

        self.args = self.reqparse.parse_args()
        self.token = self.args.get('token')
        self.repo_name = self.args.get('repoName')

        super(Copy_App_To_New_Repo, self).__init__()



def handleGithubError(error, data={}):
    status = error.args[0]
    errorData = error.args[1]

    resp = {
        'data': data,
        'error': errorData,
    }

    logger.debug('Received GitHub Error with Status {status}. Error: {errorData}'.format(status=status, errorData=errorData))
    return resp, status
