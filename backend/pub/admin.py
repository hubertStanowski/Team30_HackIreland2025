from django.contrib import admin
from .models import Pub, Table, Drink, DrinkType, FavoriteDrink

# Register your models here.

admin.site.register(Pub)
admin.site.register(Table)
admin.site.register(Drink)
admin.site.register(DrinkType)
admin.site.register(FavoriteDrink)