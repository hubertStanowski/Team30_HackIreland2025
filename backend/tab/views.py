from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Tab, TabItem
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
@permission_classes([IsAuthenticated])
def open_tab(request):
    """
    Open a new tab with the provided data if no active (unpaid) tab exists for the user.
    Expected POST data:
        - pub: ID of the pub (integer)
        - table: ID of the table (integer)
t        - limit: Optional spending limit (decimal)
    """
    data = request.data

    # Check if the user already has an active (unpaid) tab.
    if Tab.objects.filter(customer=request.user, paid=False).exists():
        return Response(
            {'error': 'An active tab already exists for this user.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Create a new Tab instance.
        tab = Tab.objects.create(
            pub_id=data.get('pub'),
            table_id=data.get('table'),
            total=0,
            limit=data.get('limit'),
            customer=request.user
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

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
        'tab_items': []  # No tab items when first opened.
    }
    
    return Response(tab_data, status=status.HTTP_201_CREATED)

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
    tab.save()

    return Response({'message': 'Tab closed successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def add_tab_item(request, tab_id):
    """
    Add an item (a drink) to a tab.
    
    URL Parameter:
        - tab_id: ID of the tab to add the item to.
    
    Expected JSON payload:
        {
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
    drink_id = data.get('drink')
    quantity = data.get('quantity')

    # Validate input parameters.
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