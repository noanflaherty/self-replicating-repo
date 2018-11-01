#!/usr/bin/env python
from server import app
import os

if __name__ == "__main__":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run(debug=True, threaded=True, port=5000)
