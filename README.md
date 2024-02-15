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
curl -XPOST -H "Content-type: application/json" -d '{"refresh": "REFRESHTOKENHERE"}' 'http://localhost:8000/api/auth/token/refresh/' | jq

### Logout
curl -XPOST -H 'Authorization: Bearer TOKENHERE' -H "Content-type: application/json" 'http://localhost:8000/api/auth/logout/' | jq


curl -XPOST -H 'Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA3OTA0NDc5LCJpYXQiOjE3MDc5MDA4NzksImp0aSI6IjE5YTQ0Mzk3ZDk1ZTQwMzk5MzM4ZDM1Y2IxM2ZhNDgzIiwidXNlcl9pZCI6M30.h5ZKGT0PuIyo5FcZOGowKEbCqL67jEES2621J-Fbk79HZSLt4_x_nCQ-KuJYlAoqUKlnbaRpENUD4hoQsPmSXw' -H "Content-type: application/json" 'http://localhost:8000/api/auth/logout/' | jq

curl -XPOST -H "Content-type: application/json" -d '{ "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA3OTA0NDc5LCJpYXQiOjE3MDc5MDA4NzksImp0aSI6IjE5YTQ0Mzk3ZDk1ZTQwMzk5MzM4ZDM1Y2IxM2ZhNDgzIiwidXNlcl9pZCI6M30.h5ZKGT0PuIyo5FcZOGowKEbCqL67jEES2621J-Fbk79HZSLt4_x_nCQ-KuJYlAoqUKlnbaRpENUD4hoQsPmSXw"}' 'http://localhost:8000/api/auth/token/verify/' | jq

curl -XPOST -H 'Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwODUwNTY3OSwiaWF0IjoxNzA3OTAwODc5LCJqdGkiOiIxODVjNGNkYjZlNWY0ODVlYjVjNDAzMDI0NjZlMzM3NyIsInVzZXJfaWQiOjN9.I89XqU6zd1eXgAyQ8f3a4I1ByigL7z_bWBbm0mgda94VDp4KNXLz-R6ilgsP21yIOzxPWmXlplA3r8SFwnWlcg' -H "Content-type: application/json" 'http://localhost:8000/api/auth/logout/' | jq


# Credits

Favicon is from Twemoji, (c) 2020 Twitter, licensed under CC-BY 4.0

