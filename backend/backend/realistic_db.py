import os
import django
import random
from decimal import Decimal

# Setup Django environment (adjust the settings module as needed)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from myapp.models import Pub, Table, Drink, DrinkType

# Create some drink types
beer, _ = DrinkType.objects.get_or_create(name="Beer")
wine, _ = DrinkType.objects.get_or_create(name="Wine")
cocktail, _ = DrinkType.objects.get_or_create(name="Cocktail")
non_alcoholic, _ = DrinkType.objects.get_or_create(name="Non-Alcoholic")

# Create sample pubs
pub1, _ = Pub.objects.get_or_create(
    name="The Tipsy Tavern",
    address="123 Main Street",
    city="Springfield",
    province="IL",
    zip="62704",
    phone="217-555-1234",
    email="info@tipsytavern.com",
    website="http://www.tipsytavern.com"
)

pub2, _ = Pub.objects.get_or_create(
    name="The Cozy Corner",
    address="456 Elm Street",
    city="Shelbyville",
    province="IL",
    zip="62565",
    phone="217-555-5678",
    email="contact@cozycornerpub.com",
    website="http://www.cozycornerpub.com"
)

# Populate tables for pub1 (5 tables)
for i in range(1, 6):
    Table.objects.get_or_create(
        pub=pub1,
        number=i,
        capacity=random.choice([2, 4, 6, 8]),
        location=random.choice(["Window", "Center", "Patio", "Corner"]),
        description=f"Table {i} is located at the {random.choice(['entrance', 'back', 'middle'])} area.",
        busy=random.choice([False, True])
    )

# Populate tables for pub2 (3 tables)
for i in range(1, 4):
    Table.objects.get_or_create(
        pub=pub2,
        number=i,
        capacity=random.choice([2, 4, 6]),
        location=random.choice(["Window", "Booth", "Patio"]),
        description=f"Table {i} in the Cozy Corner is perfect for a relaxed evening.",
        busy=random.choice([False, True])
    )

# Create drinks for pub1
drinks_pub1 = [
    {
        "name": "Lager Delight",
        "description": "A refreshing lager with a crisp finish, perfect for a hot day.",
        "price": Decimal("5.50"),
        "drink_type": beer,
    },
    {
        "name": "Classic Martini",
        "description": "A timeless cocktail made with premium gin and vermouth.",
        "price": Decimal("8.75"),
        "drink_type": cocktail,
    },
    {
        "name": "Sunny Chardonnay",
        "description": "A smooth white wine with subtle citrus and oak notes.",
        "price": Decimal("7.25"),
        "drink_type": wine,
    },
]

for drink in drinks_pub1:
    Drink.objects.get_or_create(
        pub=pub1,
        name=drink["name"],
        description=drink["description"],
        price=drink["price"],
        drink_type=drink["drink_type"]
    )

# Create drinks for pub2
drinks_pub2 = [
    {
        "name": "Stout Strong",
        "description": "A dark stout with robust, malty flavors and a hint of bitterness.",
        "price": Decimal("6.00"),
        "drink_type": beer,
    },
    {
        "name": "Mojito Magic",
        "description": "A refreshing cocktail with mint, lime, and a splash of soda.",
        "price": Decimal("9.00"),
        "drink_type": cocktail,
    },
    {
        "name": "Rose All Day",
        "description": "A light and fruity rosé wine perfect for summer evenings.",
        "price": Decimal("7.50"),
        "drink_type": wine,
    },
    {
        "name": "Virgin Punch",
        "description": "A non-alcoholic punch bursting with fresh fruit flavors.",
        "price": Decimal("4.50"),
        "drink_type": non_alcoholic,
    },
]

for drink in drinks_pub2:
    Drink.objects.get_or_create(
        pub=pub2,
        name=drink["name"],
        description=drink["description"],
        price=drink["price"],
        drink_type=drink["drink_type"]
    )

print("Database populated with sample data!")
