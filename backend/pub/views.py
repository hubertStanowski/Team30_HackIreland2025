from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response

from tab.models import Tab
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


def busy_percentage():
    """
    Calculate the busy percentages of every pub
    :return:
    """
    for pub in Pub.objects.all():
        tableUsed = 0
        tableTotal = 0
        for table in Table.objects.filter(pub=pub):
            tableTotal += 1
            tabs = Tab.objects.filter(table=table)
            if tabs:
                tableUsed += 1
        percentage = tableUsed / tableTotal * 100
        pub = {
            'busy_percentage': percentage
        }
        pub.save()
