from django.contrib import admin
from django.urls import path
from .views import tab_list, stripe_payment, open_tab

urlpatterns = [
    path("", tab_list),
    path("payment/", stripe_payment),
    path('open', open_tab, name='open-tab')

]
