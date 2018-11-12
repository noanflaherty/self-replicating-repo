import os
from dotenv import load_dotenv
import redis

load_dotenv()

APP_SECRET_KEY = os.environ.get('APP_SECRET_KEY')
SERVICE_TOKEN = os.environ.get('SERVICE_TOKEN')

SESSION_TYPE = os.environ.get('SESSION_TYPE')
SESSION_REDIS = redis.Redis(host=os.environ.get('SESSION_REDIS_HOST'), port=os.environ.get('SESSION_REDIS_PORT'))

SOCKET_MESSAGE_QUEUE = os.environ.get('SOCKET_MESSAGE_QUEUE')

GITHUB_CLIENT_ID = os.environ.get('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.environ.get('GITHUB_CLIENT_SECRET')
