from django.shortcuts import render

from rest_framework import viewsets
from .models import Event, EventType
from .serializers import EventSerializer, EventTypeSerializer
from rest_framework.response import Response
from rest_framework import mixins
from functools import wraps

import logging
logger = logging.getLogger(__name__)

# Decorator, to only allow a user to interact with their own elements
# Used in EventViewSet below
def check_event_permission(view_func):
    @wraps(view_func)
    def _wrapped_view(view, request, *args, **kwargs):
        instance = view.get_object()
        if instance.user != request.user:
            return Response({'error': 'Forbidden'}, status=403)
        return view_func(view, request, *args, **kwargs)
    return _wrapped_view

# For event types, we allow the user to create new ones, and list existing ones, but that's it
class EventTypeViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer

    # Override: list both the user's types, and the generic ones
    def list(self, request):
        # Either current user or no user (generic event types, added as Seeds)
        queryset = EventType.objects.filter(user=request.user) | EventType.objects.filter(user=None)
        serializer = EventTypeSerializer(queryset, many=True)
        return Response(serializer.data)

    # Override: Each element created with the API will also have the user Id who created it
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# For events, we allow the entire CRUD, but only for the elements that the user created
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    # Override: Only list the user's own events
    def list(self, request):
        queryset = Event.objects.filter(user=request.user)
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    # Override: Only allow getting the user's own events
    @check_event_permission
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # Override: On every create, we associate the current user Id to the element
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    # Override: Only allow full update of the user's own events
    @check_event_permission
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    # Override: Only allow partial update of the user's own events
    @check_event_permission
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    # Override: Only allow deleting the user's own events
    @check_event_permission
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
