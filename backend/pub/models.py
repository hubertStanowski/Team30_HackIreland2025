from django.db import models

# Create your models here.

class Pub(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    zip = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    website = models.URLField(max_length=100)
    image = models.ImageField(upload_to='pubs', blank=True)

    def __str__(self):
        return self.name

class Table(models.Model):
    pub = models.ForeignKey(Pub, on_delete=models.CASCADE)
    number = models.IntegerField()
    capacity = models.IntegerField()
    location = models.CharField(max_length=100)
    description = models.TextField()
    bussy = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.pub.name} - Table {self.number}'

class Drink(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.ImageField(upload_to='drinks', blank=True)
    drink_type = models.ForeignKey('DrinkType', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class DrinkType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name