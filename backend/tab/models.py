from django.conf import settings
from django.db import models


class Tab(models.Model):
    drinks = models.ManyToManyField('pub.Drink', through='TabItem')
    pub = models.ForeignKey('pub.Pub', on_delete=models.CASCADE)
    table = models.ForeignKey('pub.Table', on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=5, decimal_places=2)
    limit = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    paid = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.pub.name} - Table {self.table.number}'


class TabItem(models.Model):
    tab = models.ForeignKey('Tab', on_delete=models.CASCADE)
    drink = models.ForeignKey('pub.Drink', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.quantity} x {self.drink.name}'

class StripeCustomer(models.Model):  # Custom user model
    customer_id = models.CharField(max_length=255, null=True, blank=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username + ' - ' + self.customer_id