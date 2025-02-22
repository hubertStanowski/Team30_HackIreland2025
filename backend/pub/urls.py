from django.contrib import admin
from django.urls import path
from .views import pub_list, pub_tabs, unpaid_pub_tabs

urlpatterns = [
    path("", pub_list),
    path("tabs/", pub_tabs),
    path("unpaid_tabs/", unpaid_pub_tabs)
]