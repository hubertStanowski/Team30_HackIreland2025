from django.contrib import admin
from django.urls import path
from .views import tab_list, open_tab

urlpatterns = [
    path("", tab_list),
    path('open', open_tab, name='open-tab')

]