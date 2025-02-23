from django.contrib import admin
from django.urls import path
from .views import pub_list, pub_tabs, unpaid_pub_tabs, busy_percentage

urlpatterns = [
    path("", pub_list),
    path("tabs/", pub_tabs),
    path("unpaid_tabs/", unpaid_pub_tabs),
    path("busy/", busy_percentage)
]