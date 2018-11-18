web: gunicorn --worker-class eventlet -w 1 wsgi:app
worker: celery -A server.celery worker
