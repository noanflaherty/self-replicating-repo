#!/usr/bin/env python
from server import app as application
import os

if __name__ == '__main__':
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    os.environ['LOCATION'] = 'PROD'
    application.run()
