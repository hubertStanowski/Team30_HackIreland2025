from django.contrib import admin
from django.urls import path
from .views import pub_list

urlpatterns = [
    path("", pub_list),

]