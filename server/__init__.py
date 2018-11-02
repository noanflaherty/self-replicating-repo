from flask import Flask, session, request, redirect, url_for, abort
from flask.json import jsonify
from requests_oauthlib import OAuth2Session
import os
import sys
import json
import logging
from logging.handlers import RotatingFileHandler
from github import Github, GithubException

from server.utils.utils import getAllFilesWPathsInDirectory, encodeFileAsBase64


def create_app(configfile=None):
    app = Flask(__name__)
    app.config.from_object('app_config')
    app.secret_key = app.config.get('APP_SECRET_KEY')
    return app


## Create the app and set configurations
app = create_app()
logger = app.logger

LOG_FILE_NAME = 'logs/log.log'
formatter = logging.Formatter("[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")

logFileHandler = RotatingFileHandler(LOG_FILE_NAME, maxBytes=10000000, backupCount=5)
logFileHandler.setLevel(logging.DEBUG)
logFileHandler.setFormatter(formatter)
logger.addHandler(logFileHandler)

stdoutLogHandler = logging.StreamHandler(stream=sys.stdout)
stdoutLogHandler.setLevel(logging.DEBUG)
logFileHandler.setFormatter(formatter)
logger.addHandler(stdoutLogHandler)


CLIENT_ID = app.config.get('GITHUB_CLIENT_ID')
CLIENT_SECRET = app.config.get('GITHUB_CLIENT_SECRET')
DEFAULT_SCOPE = ['public_repo']


@app.route("/")
def index():

    authorization_base_url = 'https://github.com/login/oauth/authorize'

    github_oauth = OAuth2Session(CLIENT_ID, scope=DEFAULT_SCOPE)
    authorization_url, state = github_oauth.authorization_url(authorization_base_url)

    session['oauth_state'] = state
    return redirect(authorization_url)


@app.route("/callback", methods=["GET"])
def callback():

    token_url = 'https://github.com/login/oauth/access_token'

    github_oauth = OAuth2Session(CLIENT_ID, state=session['oauth_state'], scope=DEFAULT_SCOPE)
    token = github_oauth.fetch_token(token_url, client_secret=CLIENT_SECRET,
                               authorization_response=request.url)

    session['oauth_token'] = token

    return redirect(url_for('.results'))


@app.route("/results", methods=["GET"])
def results():

    repo_name = request.args.get('repoName', app.config.get('DEFAULT_REPO_NAME'))
    add_to_existing = request.args.get('addToExisting', False)

    g = Github(session['oauth_token'].get('access_token'))

    # Since creating a repo happens on the user obejct, we must fetch the user first.
    user = g.get_user()

    # Try to create the repo. Creation will fail if a repo has already been created with that name.
    try:
        repo = user.create_repo(repo_name)
    # If we fail to create a repo, we check to see if it was because there was already one with that name
    except GithubException as e:
        # If there is one with that name, then we check to see if we want to add our files to the existing repo
        if add_to_existing:
            try:
                # If we do, we get the existing repo's Repository object.
                repo = user.get_repo(repo_name)
            except GithubException as e:
                return handleGithubError(e)
        else:
            return handleGithubError(e)

    # If we successfully created the repo, then we can prep all files in this app to add to the repo.
    files = getAllFilesWPathsInDirectory('.')
    files_added_successfully = []
    files_failed = []

    for i, file_path in enumerate(files):

        # Try to read the file's content.
        try:
            with open(file_path, "rb") as file:
                file_content = file.read()
        except IOError as e:
            files_failed.append(file_path_formatted)
            continue

        file_path_formatted = file_path[2:]
        commit_message = "Committing file {file_num} of {num_files}: {file_path}".format(file_num=i+1, num_files=len(files), file_path=file_path_formatted)

        logger.info(commit_message)

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
        "successfully_added":  files_added_successfully,
        "failed": files_failed
    }

    return jsonify(results)


def handleGithubError(error):
    status = error.args[0]
    data = error.args[1]
    return jsonify(data), status
