from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Tab(models.Model):
    drinks = models.ManyToManyField('pub.Drink', through='TabItem')
    pub = models.ForeignKey('pub.Pub', on_delete=models.CASCADE)
    table = models.ForeignKey('pub.Table', on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=5, decimal_places=2)
    paid = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.pub.name} - Table {self.table.number}'

class TabItem(models.Model):
    tab = models.ForeignKey('Tab', on_delete=models.CASCADE)
    drink = models.ForeignKey('pub.Drink', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.quantity} x {self.drink.name}'