# SimpleEventPlanner
A simple event planner app made with Django (DRF) and React (Remix). Made as a take-home assignment for a company.

# Installation of local environment
Tested on Ubuntu 20.04.4 LTS<br>
Requirements: Python 3.8.10 or greater, NodeJS 18.19.0 or greater<br>
You'll also need the Poetry package for Python, if you don't have it installed globally<br>
pip install poetry<br>
or in Ubuntu<br>
sudo apt install pipx<br>
pipx install poetry<br>
You'll also need venv, in Ubuntu you can install it as a package with apt<br>

# On backend

* Create a virtual environment
python -m venv env
source env/bin/activate

* Use "poetry install --no-root" to install dependencies

* Create a .env, you can use the .env.example as a guide

* Run migrations
python manage.py migrate

* Create superuser, test user and default Event Types
python manage.py seed

# On the frontend

* Install dependencies
npm install

* Create a .env, you can use the .env.example as a guide

* Run local server
npm run dev

* Build for production
npm run build

* Run production server (after the previous build step)
npm run start

# Structure

## Backend

The backend is a Django project (sep_backend) with 2 apps: "core", which has the Event and EventType models, views, routes and serializers, and "authentication", which handles all the auth stuff.<br>
The login has a CustomView that goes through Google's ReCAPTCHA first. Also, the throttle middleware is activated.<br>
The database, caching and logs are all default (SQLite and in-memory) for simplicity.<br>
The models use the TimeStampedModel mixin to have extra datetime fields: created and modified.<br>

## Frontend

I used Next.js with the app folder setup.<br>
A particular file is api/auth/[...nextauth], which is not a frontend route, and is used in conjunction with Auth.js to handle authentication with the backend, and provide hooks/callbacks related to the current user.<br>
The three main page.tsx files are the home (which also has the login component), the planner page (main UI) and the about page<br>
useMainStore.tsx has the main shared data store<br>
EventAndEventType.ts has the CRUD functions that work with the core app (backend)<br>
route.ts has the code that works with the authentication app (backend), most of it is boilerplate code from NextAuth<br>
CalendarModalsAndForms.tsx has most of the form logic (filters and CRUD)<br>
EventList and EventTimeLine are the two main views for the events<br>

# Libraries used

## Backend

* Django + Django REST Framework
* Poetry, to manage dependencies with a lockfile
* django_extensions, for the TimeStampedModel mixin, and the shell_plus command
* rest_framework_simplejwt, dj_rest_auth and allauth to manage authentication via JWT Token
* corsheaders, only used in development

## Frontend

* React + Next.js
* MUI 5 with Material UI
* NextAuth.js / Auth.js
* Zustand (global state store)
* react-hook-form
* yup for schema and validation on react-hook-form forms
* moment.js
* react-use for the useDebounce hook

# Assumptions and restrictions
* Events can't start and end at the same minute. End date must be greater than start date.

# Things that could be improved

* Finish implementing custom Event Types made by the user (Database schema is ready, but idea was scrapped due to time constraints) 
* Implement all-day events
* Implement social logins (Google, Github, etc.)
* Manage the login tokens better (for example, add a Remember Me option to increase the time, implement token blacklisting)
* Implement reCAPTCHA on other parts of the site besides the login form
* Generate documentation (drf-spectacular or some other library to generate Swagger/OpenAPI docs)
* Unit tests and Integration tests!

# Credits

Favicon is from Twemoji, (c) 2020 Twitter, licensed under CC-BY 4.0

