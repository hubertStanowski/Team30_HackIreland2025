# serializers.py
from rest_framework import serializers
from .models import Tab

class TabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tab
        fields = ['id', 'pub', 'table', 'total', 'limit', 'paid', 'created', 'updated', 'customer']
        read_only_fields = ['id', 'paid', 'created', 'updated', 'customer']

class StripeSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=5, decimal_places=2)
    currency = serializers.CharField(max_length=3)
    def create(self, validated_data):
        amount = validated_data.get('amount')
        currency = validated_data.get('currency')
        return amount, currency, 

    def update(self, instance, validated_data):
        pass

