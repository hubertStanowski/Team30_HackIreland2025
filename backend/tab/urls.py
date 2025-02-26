from django.contrib import admin
from django.urls import path
from .views import tab_list, stripe_payment, open_tab, close_tab, add_tab_item, tab_items, user_paid_tabs

urlpatterns = [
    path("", tab_list),
    path("payment/", stripe_payment),
    path("open/", open_tab, name='open-tab'),
    path("close/", close_tab, name='close-tab'),
    path('add/', add_tab_item, name='add_tab_item'),
    path("items/", tab_items),
    path('history/', user_paid_tabs)
]
