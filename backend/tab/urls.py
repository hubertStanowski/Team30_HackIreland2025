from django.contrib import admin
from django.urls import path
from .views import tab_list

urlpatterns = [
    path("", tab_list),

]