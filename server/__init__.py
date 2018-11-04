from flask import Flask, session, request, redirect, url_for, abort
from flask.json import jsonify
from requests_oauthlib import OAuth2Session
import os
import sys
import json
import logging
from logging.handlers import RotatingFileHandler
from github import Github, GithubException

from server.utils.utils import getAllFilesWPathsInDirectory


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

stdoutLogHandler = logging.StreamHandler(stream=sys.stdout)
stdoutLogHandler.setLevel(logging.DEBUG)
stdoutLogHandler.setFormatter(formatter)
logger.addHandler(stdoutLogHandler)


# Register APIs
from server.api.githubApi import github_api
app.register_blueprint(github_api.blueprint, url_prefix='/api/github')

# Register views
from server.views.index import index_view
app.register_blueprint(index_view)
