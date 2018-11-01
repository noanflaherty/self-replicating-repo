import os
import configparser

parser = configparser.ConfigParser()

basedir = os.path.abspath(os.path.dirname(__file__))
location = os.environ.get('LOCATION')

if location == "PROD":
    parser.read(os.path.join(basedir,'configs/prod_config.ini'))
else:
    parser.read(os.path.join(basedir,'configs/local_config.ini'))


APP_SECRET_KEY = parser['APP']['secret_key']

GITHUB_CLIENT_ID = parser['GITHUB']['client_id']
GITHUB_CLIENT_SECRET = parser['GITHUB']['client_secret']
GITHUB_REDIRECT_URI = parser['GITHUB']['redirect_uri']
