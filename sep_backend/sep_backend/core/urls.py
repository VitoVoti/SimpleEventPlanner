# Authentication-only routes

from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventTypeViewSet, EventViewSet

router = DefaultRouter()
router.register(r'event-types', EventTypeViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')) # API documentation
]