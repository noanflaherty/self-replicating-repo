#!/usr/bin/env python
from server import app, socketio
import os

if __name__ == "__main__":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    os.environ["FLASK_ENV"] = "development"
    os.environ["LOCATION"] = "DEVEL"
    # app.run(debug=True, threaded=True, host= '0.0.0.0', port=8000)
    socketio.run(app, host= '0.0.0.0', port=8000, debug=True)
