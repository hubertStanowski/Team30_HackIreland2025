# Generated by Django 5.1.6 on 2025-02-22 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tab", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="tab",
            name="limit",
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=5, null=True
            ),
        ),
    ]
