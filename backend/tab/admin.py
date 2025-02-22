from django.contrib import admin
from .models import Tab, TabItem, StripeCustomer

# Register your models here.

admin.site.register(Tab)
admin.site.register(TabItem)
admin.site.register(StripeCustomer)
