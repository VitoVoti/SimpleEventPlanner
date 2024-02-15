from rest_framework import serializers
from .models import Event, EventType

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ['id', 'title'] # don't allow changing user id, the backend will assign it on create

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'start_date', 'end_date', 'type'] # don't allow changing user id, the backend will assign it on create