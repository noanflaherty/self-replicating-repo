web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker wsgi:app
worker: celery -A server.celery worker
