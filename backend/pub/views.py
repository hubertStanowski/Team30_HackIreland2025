from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
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