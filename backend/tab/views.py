
import os

from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import stripe
from .serializers import StripeSerializer, TabSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Tab, TabItem
from pub.models import Table
from pub.models import Drink
from django.shortcuts import get_object_or_404


@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def tab_list(request):
    """
    List all tabs with their tab items.
    """
    tabs = Tab.objects.all()
    tabs_list = []
    for tab in tabs:
        tab_items = TabItem.objects.filter(tab=tab)
        tab_items_list = list(tab_items.values())
        tab_data = {
            'id': tab.id,
            'pub': tab.pub.name,
            'table': tab.table.number,
            'total': tab.total,
            'limit': tab.limit,
            'paid': tab.paid,
            'created': tab.created,
            'updated': tab.updated,
            'customer': tab.customer.username,
            'tab_items': tab_items_list
        }
        tabs_list.append(tab_data)

    return Response(tabs_list)




@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def stripe_payment(request):
    """
    Process a payment with Stripe
    :return:
    """
    serializer = StripeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        amount = validated_data.get('amount')
        currency = validated_data.get('currency')

        stripe.api_key = os.getenv('STRIPE_SK')

        customer = stripe.Customer.create()

        # customer = stripe.Customer.retrieve()

        ephemeralKey = stripe.EphemeralKey.create(
            customer=customer['id'],
            stripe_version='2025-01-27.acacia',
        )

        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Stripe expects the amount in cents
            currency=currency,
            customer=customer["id"],
            automatic_payment_methods={
                'enabled': True,
            },
        )

        response_data = {
            'paymentIntent': intent,
            'ephemeralKey': ephemeralKey.secret,
            'customer': customer.id,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def open_tab(request):
    """
    Open a new tab with the provided table ID and optional limit.
    Retrieves the pub id from the given table.
    Expected POST data:
        - table: ID of the table (integer)
        - limit: Optional spending limit (decimal)
    """
    data = request.data

    # Check if the user already has an active (unpaid) tab.
    if Tab.objects.filter(customer=request.user, paid=False).exists():
        return Response(
            {'error': 'An active tab already exists for this user.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    table_id = data.get('table')
    if not table_id:
        return Response(
            {'error': 'Missing table id in request data.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Retrieve the table and its related pub.
    table = get_object_or_404(Table, id=table_id)
    pub = table.pub

    try:
        # Create a new Tab instance.
        tab = Tab.objects.create(
            pub=pub,
            table=table,
            total=0,
            limit=data.get('limit'),
            customer=request.user
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Mark the table as busy.
    table.busy = True
    table.save()

    tab_data = {
        'id': tab.id,
        'pub': pub.name,
        'table': table.number,
        'total': str(tab.total),
        'limit': str(tab.limit) if tab.limit else None,
        'paid': tab.paid,
        'created': tab.created.isoformat(),
        'updated': tab.updated.isoformat(),
        'customer': tab.customer.username,
        'tab_items': []  # No tab items when first opened.
    }

    serializer = TabSerializer(tab)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def close_tab(request):
    """
    Close (mark as paid) an active tab.
    The tab_id is passed in the request body.
    """
    tab_id = request.data.get('tab_id')
    if not tab_id:
        return Response({'error': 'tab_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        tab = Tab.objects.get(id=tab_id, customer=request.user, paid=False)
    except Tab.DoesNotExist:
        return Response({'error': 'Active tab not found.'}, status=status.HTTP_400_BAD_REQUEST)

    tab.paid = True
    table = tab.table
    table.busy = False
    table.save()
    tab.save()  

    return Response({'message': 'Tab closed successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def add_tab_item(request):
    """
    Add an item (a drink) to a tab.
    
    Expected JSON payload:
        {
            "tab_id": <tab_id>,
            "drink": <drink_id>,
            "quantity": <quantity>
        }
    
    This view performs the following steps:
      - Validates input parameters.
      - Ensures that the tab exists, is active (unpaid), and belongs to the authenticated user.
      - Ensures that the drink exists and belongs to the same pub as the tab.
      - Creates or updates the TabItem accordingly.
      - Updates the tab's total based on all items.
    """
    data = request.data
    tab_id = data.get('tab_id')
    drink_id = data.get('drink')
    quantity = data.get('quantity')

    # Validate input parameters.
    if not tab_id:
        return Response({'error': 'Tab ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not drink_id:
        return Response({'error': 'Drink ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not quantity:
        return Response({'error': 'Quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        quantity = int(quantity)
        if quantity < 1:
            return Response({'error': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
        return Response({'error': 'Quantity must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the tab ensuring it belongs to the authenticated user and is active.
    tab = get_object_or_404(Tab, id=tab_id, customer=request.user, paid=False)
    
    # Retrieve the drink.
    drink = get_object_or_404(Drink, id=drink_id)
    
    # Check if the drink belongs to the same pub as the tab.
    if drink.pub.id != tab.pub.id:
        return Response({'error': 'The selected drink does not belong to the same pub as the tab.'},
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Create or update the TabItem.
    tab_item, created = TabItem.objects.get_or_create(
        tab=tab,
        drink=drink,
        defaults={'quantity': quantity}
    )
    if not created:
        tab_item.quantity += quantity
        tab_item.save()
    
    # Recalculate the tab total based on all tab items.
    total = 0
    for item in tab.tabitem_set.select_related('drink').all():
        total += item.quantity * item.drink.price
    tab.total = total
    tab.save()
    
    # Prepare response data.
    response_data = {
        'tab_item_id': tab_item.id,
        'tab_id': tab.id,
        'drink': drink.name,
        'quantity': tab_item.quantity,
        'updated_total': str(tab.total)  # convert Decimal to string for JSON serialization
    }
    
    return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def tab_items(request):
    """
    Retrieve all items in a specific tab along with their prices,
    but only if the user is authenticated and the tab belongs to them.
    
    Expects a POST request with a JSON body containing:
    {
        "tab_id": <tab_id>
    }
    """
    tab_id = request.data.get('tab_id')
    if not tab_id:
        return Response({'error': "Missing 'tab_id' in request body."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    tab = get_object_or_404(Tab, id=tab_id)
    
    # Check if the tab belongs to the authenticated user
    if tab.customer != request.user:
        return Response({'error': "You do not have permission to view this tab."},
                        status=status.HTTP_403_FORBIDDEN)
    
    tab_items_qs = TabItem.objects.filter(tab=tab)
    
    items_list = []
    for item in tab_items_qs:
        items_list.append({
            "drink": item.drink.name,
            "price": str(item.drink.price),
            "quantity": item.quantity,
            "subtotal": str(item.drink.price * item.quantity)
        })
    
    response_data = {
        "tab": {
            "id": tab.id,
            "pub": tab.pub.name,
            "table": tab.table.number,
        },
        "items": items_list,
    }
    
    return Response(response_data)
