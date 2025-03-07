import os

workers = 2

timeout = 30

bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:5001')

forwarded_allow_ips = '*'

secure_scheme_headers = { 'X-Forwarded-Proto': 'https' }

accesslog = '-'
errorlog = '-'
loglevel = 'debug'
