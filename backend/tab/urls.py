from django.contrib import admin
from django.urls import path
from .views import tab_list, open_tab, close_tab, add_tab_item

urlpatterns = [
    path("", tab_list),
    path("open/", open_tab, name='open-tab'),
    path("close/", close_tab, name='close-tab'),
    path('tabs/<int:tab_id>/items/add/', add_tab_item, name='add_tab_item'),
]