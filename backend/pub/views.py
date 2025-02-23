from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tab.models import Tab, TabItem
from .models import Pub


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


def busy_percentage():
    """
    Calculate the busy percentages of every pub
    :return:
    """
    for pub in Pub.objects.all():
        tableUsed = 0
        tableTotal = 0
        for table in table.objects.filter(pub=pub):
            tableTotal += 1
            tabs = Tab.objects.filter(table=table)
            if tabs:
                tableUsed += 1
        percentage = tableUsed / tableTotal * 100
        pub = {
            'busy_percentage': percentage
        }
        pub.save()

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def retrieve_tabs_history(request):
    """
    Retrieve the tab history of a customer
    :return:
    """
    tabs = Tab.objects.filter(customer=request.user)
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