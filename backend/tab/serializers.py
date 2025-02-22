# serializers.py
from rest_framework import serializers
from .models import Tab

class TabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tab
        fields = ['id', 'pub', 'table', 'total', 'limit', 'paid', 'created', 'updated', 'customer']
        read_only_fields = ['id', 'paid', 'created', 'updated', 'customer']
