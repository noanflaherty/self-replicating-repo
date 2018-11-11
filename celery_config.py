import os
from dotenv import load_dotenv

load_dotenv()

# From env vars
broker_url = os.environ.get('CELERY_BROKER_URL')
result_backend = os.environ.get('CELERY_RESULT_BACKEND')

# Hard-coded
task_serializer='json'
accept_content=['json']  # Ignore other content
result_serializer='json'
enable_utc=True
