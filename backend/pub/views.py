from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Count, Q
from rest_framework.permissions import IsAuthenticated


from tab.models import Tab, TabItem
from .models import Pub, Table, Drink, FavoriteDrink

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



@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def pub_products(request):
    """
    Retrieve all products (drinks) and their prices for a given pub.
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
    drinks = Drink.objects.filter(pub=pub)
    
    products_list = []
    for drink in drinks:
        products_list.append({
            "id": drink.id,  # Added drink id to the response.
            "name": drink.name,
            "description": drink.description,
            "price": str(drink.price),
            "drink_type": drink.drink_type.name,
            "image": drink.image.url if drink.image else None,
        })
    
    response_data = {
        "pub": {
            "id": pub.id,
            "name": pub.name,
        },
        "products": products_list,
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

@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def add_favorite_drink(request):
    """
    Add a drink to the authenticated user's favorites.
    Expects JSON body:
    {
        "drink_id": <drink_id>
    }
    """
    drink_id = request.data.get('drink_id')
    if not drink_id:
        return Response({'error': "Missing 'drink_id' in request body."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    drink = get_object_or_404(Drink, id=drink_id)
    favorite, created = FavoriteDrink.objects.get_or_create(user=request.user, drink=drink)
    
    if created:
        return Response({'message': f"{drink.name} was added to your favorites."},
                        status=status.HTTP_201_CREATED)
    else:
        return Response({'message': f"{drink.name} is already in your favorites."},
                        status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def remove_favorite_drink(request):
    """
    Remove a drink from the authenticated user's favorites.
    Expects JSON body:
    {
        "drink_id": <drink_id>
    }
    """
    drink_id = request.data.get('drink_id')
    if not drink_id:
        return Response({'error': "Missing 'drink_id' in request body."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    drink = get_object_or_404(Drink, id=drink_id)
    favorite = FavoriteDrink.objects.filter(user=request.user, drink=drink).first()
    if favorite:
        favorite.delete()
        return Response({'message': f"{drink.name} was removed from your favorites."},
                        status=status.HTTP_200_OK)
    else:
        return Response({'error': f"{drink.name} is not in your favorites."},
                        status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def list_favorite_drinks_by_pub(request):
    """
    List all favorite drinks for the authenticated user at a specific pub.
    Expects the pub id as a query parameter, e.g., /api/favorites/?pub_id=1
    """
    pub_id = request.data.get('pub_id')
    if not pub_id:
        return Response({'error': "Missing 'pub_id' in query parameters."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    favorites = FavoriteDrink.objects.filter(user=request.user, drink__pub__id=pub_id)
    favorite_list = []
    for fav in favorites:
        favorite_list.append({
            "id": fav.drink.id,
            "name": fav.drink.name,
            "description": fav.drink.description,
            "price": str(fav.drink.price),
            "drink_type": fav.drink.drink_type.name,
            "image": fav.drink.image.url if fav.drink.image else None,
            "favorited_at": fav.favorited_at.isoformat(),
        })

    return Response({"favorites": favorite_list}, status=status.HTTP_200_OK)

