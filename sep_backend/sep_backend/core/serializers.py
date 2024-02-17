from rest_framework import serializers
from .models import Event, EventType

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ['id', 'title', 'color', 'created', 'modified'] # don't allow changing user id, the backend will assign it on create
        extra_kwargs = {
            'created': {'read_only': True},
            'modified': {'read_only': True}
        }

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'start_date', 'end_date', 'type', 'created', 'modified'] # don't allow changing user id, the backend will assign it on create
        extra_kwargs = {
            'created': {'read_only': True},
            'modified': {'read_only': True}
        }