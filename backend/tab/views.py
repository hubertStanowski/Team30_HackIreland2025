from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from .models import Tab, TabItem
from rest_framework import status


@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def tab_list(request):
    """
    List all tabs with their tab items
    :return:
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
    Open a new tab with the provided data.
    Expected POST data:
        - pub: ID of the pub (integer)
        - table: ID of the table (integer)
        - total: Total amount (decimal)
        - limit: Optional spending limit (decimal)
    """
    data = request.data

    try:
        # Create a new Tab instance.
        tab = Tab.objects.create(
            pub_id=data.get('pub'),
            table_id=data.get('table'),
            total=data.get('total'),
            limit=data.get('limit'),
            customer=request.user
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Response data similar to tab_list
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
        'tab_items': []  # New tab; no tab items yet.
    }
    
    return Response(tab_data, status=status.HTTP_201_CREATED)