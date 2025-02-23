# serializers.py
from rest_framework import serializers
from .models import Tab

class TabSerializer(serializers.ModelSerializer):
    # Represent the pub by its name
    pub = serializers.CharField(source='pub.name')
    # Represent the table by its number
    table = serializers.IntegerField(source='table.number')
    # Represent the customer by their username
    customer = serializers.CharField(source='customer.username')
    # Format total and limit as strings to mimic your view
    total = serializers.SerializerMethodField()
    limit = serializers.SerializerMethodField()
    # ISO formatted datetime fields; you can customize the format if needed.
    created = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ')
    updated = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ')
    # For tab_items, if you later want to include nested data, you can swap out the method field.
    tab_items = serializers.SerializerMethodField()

    class Meta:
        model = Tab
        fields = (
            'id',
            'pub',
            'table',
            'total',
            'limit',
            'paid',
            'created',
            'updated',
            'customer',
            'tab_items',
        )

    def get_total(self, obj):
        return str(obj.total)

    def get_limit(self, obj):
        return str(obj.limit) if obj.limit is not None else None

    def get_tab_items(self, obj):
        # Assuming no tab items at creation; update this if you have a nested serializer for tab items.
        return []

class StripeSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=5, decimal_places=2)
    currency = serializers.CharField(max_length=3)

    def create(self, validated_data):
        amount = validated_data.get('amount')
        currency = validated_data.get('currency')

        return amount, currency

    def update(self, instance, validated_data):
        pass

