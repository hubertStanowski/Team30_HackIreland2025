from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Count, Q

from tab.models import Tab, TabItem
from .models import Pub, Table

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def pub_list(request):
    """
    List all pubs
    :return:
    """
    pubs = Pub.objects.all()
    pubs_list = list(pubs.values())
    return Response(pubs_list)

@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def unpaid_pub_tabs(request):
    """
    Retrieve all unpaid tabs for a given pub along with their items and prices.
    Expects a POST request with a JSON body containing:
    {
        "pub_id": <pub_id>
    }
    """
    pub_id = request.data.get('pub_id')
    if not pub_id:
        return Response({'error': "Missing 'pub_id' in request body."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    pub = get_object_or_404(Pub, id=pub_id)
    # Filter only the tabs that have not been paid.
    tabs = Tab.objects.filter(pub=pub, paid=False)
    
    tabs_list = []
    for tab in tabs:
        # Retrieve all items for the current tab
        tab_items_qs = TabItem.objects.filter(tab=tab)
        items_list = []
        for item in tab_items_qs:
            items_list.append({
                "drink": item.drink.name,
                "price": str(item.drink.price),
                "quantity": item.quantity,
                "subtotal": str(item.drink.price * item.quantity)
            })
        tabs_list.append({
            "tab_id": tab.id,
            "table_number": tab.table.number,
            "total": str(tab.total),
            "paid": tab.paid,
            "created": tab.created.isoformat(),
            "updated": tab.updated.isoformat(),
            "items": items_list,
        })
    
    response_data = {
        "pub": {
            "id": pub.id,
            "name": pub.name,
        },
        "tabs": tabs_list,
    }
    
    return Response(response_data)

@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def pub_tabs(request):
    """
    Retrieve all tabs for a given pub along with their items and prices.
    Expects a POST request with a JSON body containing:
    {
        "pub_id": <pub_id>
    }
    """
    pub_id = request.data.get('pub_id')
    if not pub_id:
        return Response({'error': "Missing 'pub_id' in request body."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    pub = get_object_or_404(Pub, id=pub_id)
    tabs = Tab.objects.filter(pub=pub)
    
    tabs_list = []
    for tab in tabs:
        # Retrieve all items for the current tab
        tab_items_qs = TabItem.objects.filter(tab=tab)
        items_list = []
        for item in tab_items_qs:
            items_list.append({
                "drink": item.drink.name,
                "price": str(item.drink.price),
                "quantity": item.quantity,
                "subtotal": str(item.drink.price * item.quantity)
            })
        tabs_list.append({
            "tab_id": tab.id,
            "table_number": tab.table.number,
            "total": str(tab.total),
            "paid": tab.paid,
            "created": tab.created.isoformat(),
            "updated": tab.updated.isoformat(),
            "items": items_list,
        })
    
    response_data = {
        "pub": {
            "id": pub.id,
            "name": pub.name,
        },
        "tabs": tabs_list,
    }
    
    return Response(response_data)


@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def busy_percentage(request):
    """
    Calculate the busy percentages of every pub based on the 'busy' attribute of tables.
    Returns a list of all pubs with their corresponding busy percentage.
    """
    pubs = Pub.objects.annotate(
        table_count=Count('table', distinct=True),
        busy_table_count=Count('table', filter=Q(table__busy=True), distinct=True)
    )

    pub_data = []
    for pub in pubs:
        tableTotal = pub.table_count
        tableBusy = pub.busy_table_count
        percentage = (tableBusy / tableTotal * 100) if tableTotal > 0 else 0

        # Update and save the busy percentage in the database
        pub.busy_percentage = percentage
        pub.save()

        # Append pub data to the list
        pub_data.append({
            "id": pub.id,
            "name": pub.name,
            "busy_percentage": round(percentage, 2)  # Rounded to 2 decimal places
        })

    return Response({"pubs": pub_data})


