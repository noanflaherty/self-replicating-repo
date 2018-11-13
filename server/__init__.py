from flask import (
    Flask,
    session,
    request,
    redirect,
    url_for,
    abort,
    jsonify
)
from flask_socketio import SocketIO
from flask_session import Session
from celery import Celery
import os
import sys
import json
import logging
from logging.handlers import RotatingFileHandler
from github import Github, GithubException

from server.utils.utils import getAllFilesWPathsInDirectory


def create_app(config_file='app_config'):
    app = Flask(__name__)
    app.config.from_object(config_file)
    Session(app)
    return app

def create_celery(app, config_file='celery_config'):
    # Initialize Celery
    celery = Celery(app.name)
    celery.config_from_object(config_file)
    celery.conf.update(
        include='server.tasks',
    )
    return celery

def create_logger(app, level='DEBUG'):
    logger = app.logger

    # formatter = logging.Formatter("[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
    formatter = logging.Formatter("[%(asctime)s] %(name)s - %(levelname)s - %(message)s")

    stdoutLogHandler = logging.StreamHandler(stream=sys.stdout)
    stdoutLogHandler.setLevel(level)
    stdoutLogHandler.setFormatter(formatter)

    logger.addHandler(stdoutLogHandler)

    return logger

def create_socketio(app, logger=None):
    return SocketIO(app, manage_session=False, logger=logger)


## Create the app and set configurations
app = create_app()


# Initialize logger
logger = create_logger(app)


# SocketIO
socketio = create_socketio(app, logger=logger)
from server.sockets import *


# Create celery
celery = create_celery(app);


# Register APIs
from server.api.githubApi import github_api
app.register_blueprint(github_api.blueprint, url_prefix='/api/github')
from server.api.messageApi import message_api
app.register_blueprint(message_api.blueprint, url_prefix='/api/message')


# Register views
from server.views.index import index_view
app.register_blueprint(index_view)


# Register sockets
