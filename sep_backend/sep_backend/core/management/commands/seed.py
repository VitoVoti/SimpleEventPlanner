from django.core.management.base import BaseCommand
from sep_backend.core.models import EventType, Event
import random
from django.contrib.auth import get_user_model

# python manage.py seed

import logging
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Adds initial EventType elements to the database, an admin user and a test user"

    def add_arguments(self, parser):
        parser.add_argument('--mode', type=str, help="Mode")

    def handle(self, *args, **options):
        self.stdout.write('Calling seed function...')
        seed(self)
        self.stdout.write('End of seed function.')


def seed(self):

    User = get_user_model()

    # Check if we have events
    events = EventType.objects.all()
    if len(events) > 0:
        self.stdout.write('Events already exist, skipping...')
    else:
        self.stdout.write('Creating event types...')
        EventType.objects.create(title='Meeting', color='##1975d2')
        EventType.objects.create(title='Training', color='##e25141')
        EventType.objects.create(title='Workshop', color='#4caf50')
        EventType.objects.create(title='Leisure', color='#ffeb3b')
        self.stdout.write('Event types created!')
    
    # Check if we have admins
    admins = User.objects.filter(is_superuser=True)
    if len(admins) > 0:
        self.stdout.write('Admins already exist, skipping...')
    else:
        self.stdout.write('Creating admin user...')
        admin_password = User.objects.make_random_password(length=14)
        admin_user = User.objects.create_superuser('admin', password=admin_password)
        admin_user.save()
        self.stdout.write('Admin user created with password: ' + admin_password)
    
    # Check if we have test users
    test_users = User.objects.filter(username='test_user')
    if len(test_users) > 0:
        self.stdout.write('Test users already exist, skipping...')
    else:
        self.stdout.write('Creating test user...')
        user_password = User.objects.make_random_password(length=14)
        user = User.objects.create_user('johnsmith', password=user_password)
        user.save()
        self.stdout.write('Test user created with password: ' + user_password)

    self.stdout.write('Seeding complete!')

