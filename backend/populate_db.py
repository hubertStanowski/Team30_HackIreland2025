import os
import django
import random
from decimal import Decimal
from faker import Faker

# Set up Django environment (adjust 'myproject.settings' to your settings module)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from pub.models import Pub, Table, Drink, DrinkType  # replace 'your_app' with your actual app name

fake = Faker()

def create_drink_types(n=5):
    """Creates n random DrinkTypes."""
    drink_types = []
    for _ in range(n):
        # Ensure uniqueness by using a unique name with Faker
        name = fake.unique.word().capitalize()
        dt, created = DrinkType.objects.get_or_create(name=name)
        drink_types.append(dt)
    return drink_types

def create_pubs(n=10):
    """Creates n random Pub objects."""
    pubs = []
    for _ in range(n):
        pub = Pub.objects.create(
            name=fake.company(),
            address=fake.street_address(),
            city=fake.city(),
            province=fake.state(),
            zip=fake.postcode(),
            phone=fake.phone_number(),
            email=fake.company_email(),
            website=fake.url(),
            # image field left blank; you can assign a default image or file path if needed
        )
        pubs.append(pub)
    return pubs

def create_tables_for_pub(pub, min_tables=3, max_tables=8):
    """Creates a random number of Table objects for a given pub."""
    num_tables = random.randint(min_tables, max_tables)
    for i in range(1, num_tables + 1):
        Table.objects.create(
            pub=pub,
            number=i,
            capacity=random.choice([2, 4, 6, 8]),
            location=random.choice(['Indoor', 'Outdoor', 'Rooftop', 'VIP']),
            description=fake.sentence(nb_words=10),
        )

def create_drinks_for_pub(pub, drink_types, min_drinks=5, max_drinks=15):
    """Creates a random number of Drink objects for a given pub."""
    num_drinks = random.randint(min_drinks, max_drinks)
    for _ in range(num_drinks):
        Drink.objects.create(
            name=fake.word().capitalize(),
            description=fake.text(max_nb_chars=100),
            price=Decimal(random.uniform(1.0, 20.0)).quantize(Decimal("0.01")),
            # image field left blank; you can assign a default image or file path if needed
            drink_type=random.choice(drink_types),
            pub=pub,
        )

def run():
    # Create drink types first
    drink_types = create_drink_types(n=5)
    print(f"Created {len(drink_types)} drink types.")

    # Create pubs
    pubs = create_pubs(n=10)
    print(f"Created {len(pubs)} pubs.")

    # For each pub, create tables and drinks
    for pub in pubs:
        create_tables_for_pub(pub)
        create_drinks_for_pub(pub, drink_types)
        print(f"Populated pub '{pub.name}' with tables and drinks.")

if __name__ == "__main__":
    run()
