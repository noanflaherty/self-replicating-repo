import os
from dotenv import load_dotenv

load_dotenv()

APP_SECRET_KEY = os.environ.get('APP_SECRET_KEY')

GITHUB_CLIENT_ID = os.environ.get('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.environ.get('GITHUB_CLIENT_SECRET')
