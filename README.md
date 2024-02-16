# SimpleEventPlanner
A simple event planner app made with Django (DRF) and React (Remix). Made as a take-home assignment for a company.

# Installation of local environment
Tested on Ubuntu 20.04.4 LTS
Requirements: Python 3.8.10 or greater, NodeJS 18.19.0 or greater
You'll also need the Poetry package for Python, if you don't have it installed globally
pip install poetry
or in Ubuntu
sudo apt install pipx
pipx install poetry
You'll also need venv, in Ubuntu you can install it as a package with apt

# On backend

* Create a virtual environment
python -m venv env
source env/bin/activate

* Use "poetry install --no-root" to install dependencies

* Create a .env, you can use the .env.example as a guide

* Run migrations
python manage.py migrate

* Create superuser (if you want to use the /admin interface when mounting locally)
python manage.py createsuperuser --username admin --email admin@example.com

* Create test user (register API endpoint is disabled for security)
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

# Structure

## Backend

The backend is a Django project (sep_backend) with 2 apps: "core", which has the Event and EventType models, views, routes and serializers, and "authentication", which handles all the auth stuff.

## Frontend

I used Next.js with the app folder.
A particular file is api/auth/[...nextauth], which is not a frontend route, and is used in conjunction with Auth.js to handle authentication with the backend, and provide hooks/callbacks related to the current user.

# Libraries used

## Backend

* Django + Django REST Framework
* Poetry, to manage dependencies with a lockfile
* django_extensions, for the TimeStampedModel mixin, and the shell_plus command
* rest_framework_simplejwt, dj_rest_auth and allauth to manage authentication via JWT Token
* corsheaders, only used in development

## Frontend

* React + Next.js
* MUI 5
* Auth.js
* Zustand (global state store)
* react-hook-form
* yup for schema and validation on react-hook-form forms
* moment.js
* react-use for the useDebounce hook

# Assumptions and restrictions
* Events can't start and end at the same minute. End date must be greater than start date.

# Things that could be improved

* Implement all-day events
* Implement social logins (Google, Github, etc.)
* Manage the login tokens better (for example, add a Remember Me option to increase the time, implement token blacklisting)
* Implement reCAPTCHA on other parts of the site besides the login form
* Generate documentation (drf-spectacular or some other library to generate Swagger/OpenAPI docs)
* Unit tests and Integration tests!

* A separate endpoint to get paginated results from the Event model. Right now, they are all returned at once.

# Credits

Favicon is from Twemoji, (c) 2020 Twitter, licensed under CC-BY 4.0

