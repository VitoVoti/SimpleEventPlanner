from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *
#import core


@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'created', 'modified')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'start_date', 'end_date', 'type', 'user', 'created', 'modified')



#models = core.get_models()

#for model in models:
#    admin.site.register(model)