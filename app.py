#!/usr/bin/env python
from server import app as application, socketio
import os

if __name__ == "__main__":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    os.environ["FLASK_ENV"] = "development"
    # application.run(debug=True, threaded=True, host= '0.0.0.0', port=8000)
    socketio.run(application, debug=True, host= '0.0.0.0', port=8000, log_output=True)
