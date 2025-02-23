from django.contrib import admin
from django.urls import path
from .views import pub_list, pub_tabs, unpaid_pub_tabs, busy_percentage, pub_products, add_favorite_drink, remove_favorite_drink, list_favorite_drinks_by_pub, get_drink_suggestion


urlpatterns = [
    path("", pub_list),
    path("tabs/", pub_tabs),
    path("unpaid_tabs/", unpaid_pub_tabs),
    path("busy/", busy_percentage),
    path("items/", pub_products),
    path('favorites/add/', add_favorite_drink, name='add_favorite_drink'),
    path('favorites/remove/', remove_favorite_drink, name='remove_favorite_drink'),
    path('favorites/', list_favorite_drinks_by_pub, name='list_favorite_drinks_by_pub'),
    path('drink_suggestion/', get_drink_suggestion)
]