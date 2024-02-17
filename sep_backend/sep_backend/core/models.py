from django.db import models
from django.contrib.auth.models import User
from django_extensions.db.models import (
	TimeStampedModel, #created, modified fields
)
from rest_framework import serializers

class EventType(TimeStampedModel, models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True) # Some EventTypes are for everyone, if this field is empty
    color = models.CharField(max_length=10, default="#1975d2") # Color for the dot at the left of an event, HEX format

    def __str__(self):
        return self.title
    
    class Meta:
        # A user can't have more than 1 EventType with the same title
        unique_together = ('title', 'user')


class Event(TimeStampedModel, models.Model):
    title = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def validate(self, value):
        # Validates that the start_date is not past the end_date
        if value['start_date'] >= value['end_date']:
            raise serializers.ValidationError("Start date can't be equal to end date, or be past it")
        # Validate that the start and end aren't the same, at least with a 1 minute difference
        minutes_between = (value['end_date'] - value['start_date']).seconds / 60
        if minutes_between < 1:
            raise serializers.ValidationError("Event must last at least 1 minute")
        # Validates that the event type is either global (user == None), or made by the user
        if value['type'].user is not None and value['type'].user != value['user']:
            raise serializers.ValidationError("Event type is not for the user")

        return value

    def __str__(self):
        return self.title