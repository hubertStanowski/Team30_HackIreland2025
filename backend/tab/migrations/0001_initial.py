# Generated by Django 4.2.19 on 2025-02-22 20:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('pub', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tab',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total', models.DecimalField(decimal_places=2, max_digits=5)),
                ('limit', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('paid', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TabItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('drink', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pub.drink')),
                ('tab', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tab.tab')),
            ],
        ),
        migrations.AddField(
            model_name='tab',
            name='drinks',
            field=models.ManyToManyField(through='tab.TabItem', to='pub.drink'),
        ),
        migrations.AddField(
            model_name='tab',
            name='pub',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pub.pub'),
        ),
        migrations.AddField(
            model_name='tab',
            name='table',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pub.table'),
        ),
        migrations.CreateModel(
            name='StripeCustomer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_id', models.CharField(blank=True, max_length=255, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
