from server import app, celery

@celery.task
def add(x, y):
    return x + y
