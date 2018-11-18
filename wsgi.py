#!/usr/bin/env python
from server import app, socketio
import os

if __name__ == '__main__':
    socketio.run(app)
