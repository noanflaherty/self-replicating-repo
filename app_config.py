import os
from dotenv import load_dotenv
import redis

load_dotenv()

LOCATION = os.environ.get('LOCATION')

APP_SECRET_KEY = os.environ.get('APP_SECRET_KEY')
SERVICE_TOKEN = os.environ.get('SERVICE_TOKEN')
SESSION_TYPE = os.environ.get('SESSION_TYPE')
REDIS_URL = os.environ.get('REDIS_URL')
SESSION_REDIS = redis.Redis.from_url(REDIS_URL)
SERVER_NAME = os.environ.get('SERVER_NAME')


SOCKET_MESSAGE_QUEUE = os.environ.get('SOCKET_MESSAGE_QUEUE')

GITHUB_CLIENT_ID = os.environ.get('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.environ.get('GITHUB_CLIENT_SECRET')
