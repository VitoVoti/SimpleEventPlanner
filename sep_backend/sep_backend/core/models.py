from django.db import models
from django.contrib.auth.models import User
from django_extensions.db.models import (
	TimeStampedModel, #created, updated fields
)

class EventType(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True) # Some EventTypes are for everyone, if this field is empty

    def __str__(self):
        return self.title

class Event(models.Model):
    title = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title