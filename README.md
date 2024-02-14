# SimpleEventPlanner
A simple event planner app made with Django (DRF) and React (Remix). Made as a take-home assignment for a company.

# On backend

## First, fill the .env
use "poetry install" to install dependencies

## Create superuser (if you want to use the /admin interface when mounting locally)
python manage.py createsuperuser --username admin --email admin@example.com

## Create test user (register API endpoint is disabled for security)
python manage.py shell

from django.contrib.auth.models import User
user=User.objects.create_user('johnsmith', password='J8j71mPc0eS')
exit()

## Test login (should return basic user info, access token and refresh token)
curl -XPOST -H "Content-type: application/json" -d '{"username": "johnsmith", "password": "J8j71mPc0eS" }' 'http://localhost:8000/api/auth/login/' | jq

## Other endpoints

### 200 response with {} means it's still valid
curl -XPOST -H "Content-type: application/json" -d '{ "token": "TOKENHERE"}' 'http://localhost:8000/api/auth/token/verify/' | jq

### Refresh
curl -XPOST -H "Content-type: application/json" -d '{"refresh": "your_refresh_token>"}' 'http://localhost:8000/api/auth/token/refresh/' | jq

### Logout
curl -XPOST -H 'Authorization: Bearer <your_access-token>' -H "Content-type: application/json" 'http://localhost:8000/api/auth/logout/' | jq

