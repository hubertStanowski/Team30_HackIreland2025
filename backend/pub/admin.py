from django.contrib import admin
from .models import Pub, Table, Drink

# Register your models here.

admin.site.register(Pub)
admin.site.register(Table)
admin.site.register(Drink)