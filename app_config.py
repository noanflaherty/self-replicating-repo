import os
import configparser

parser = configparser.ConfigParser()

basedir = os.path.abspath(os.path.dirname(__file__))
location = os.environ.get('LOCATION')

if location == 'PROD':
    parser.read(os.path.join(basedir,'configs/server_prod_config.ini'))
else:
    parser.read(os.path.join(basedir,'configs/server_local_config.ini'))


APP_SECRET_KEY = parser['APP']['secret_key']

GITHUB_CLIENT_ID = parser['GITHUB']['client_id']
GITHUB_CLIENT_SECRET = parser['GITHUB']['client_secret']
