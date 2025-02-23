from django.contrib import admin
from django.urls import path
from .views import pub_list, retrieve_tabs_history

urlpatterns = [
    path("", pub_list),
    path("history/", retrieve_tabs_history),
]