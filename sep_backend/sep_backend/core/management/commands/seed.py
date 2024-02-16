from django.core.management.base import BaseCommand
from sep_backend.core.models import EventType, Event
import random
from django.contrib.auth import get_user_model

# python manage.py seed

class Command(BaseCommand):
    help = "Adds initial EventType elements to the database, an admin user and a test user"

    def add_arguments(self, parser):
        parser.add_argument('--mode', type=str, help="Mode")

    def handle(self, *args, **options):
        self.stdout.write('seeding data...')
        seed(self)
        self.stdout.write('done.')


def clear_data():
    """Deletes all the table data"""
    logger.info("Delete Address instances")
    Address.objects.all().delete()


def create_address():
    """Creates an address object combining different elements from the list"""
    logger.info("Creating address")
    street_flats = ["#221 B", "#101 A", "#550I", "#420G", "#A13"]
    street_localities = ["Bakers Street", "Rajori Gardens", "Park Street", "MG Road", "Indiranagar"]
    pincodes = ["101234", "101232", "101231", "101236", "101239"]

    address = Address(
        street_flat=random.choice(street_flats),
        street_locality=random.choice(street_localities),
        pincode=random.choice(pincodes),
    )
    address.save()
    logger.info("{} address created.".format(address))
    return address

def seed(self):

    User = get_user_model()

    # Check if we have events
    events = EventType.objects.all()
    if len(events) > 0:
        self.stdout.write('Events already exist, skipping...')
    else:
        self.stdout.write('Creating event types...')
        EventType.objects.create(title='Meeting')
        EventType.objects.create(title='Training')
        EventType.objects.create(title='Workshop')
        EventType.objects.create(title='Leisure')
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

