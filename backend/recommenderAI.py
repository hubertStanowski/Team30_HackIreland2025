import numpy as np
import pandas as pd
import random
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from pub.models import Drink, Tab, TabItem
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict

def get_user_drink_matrix():
    """
    Create a user-drink interaction matrix based on past orders.
    """
    tab_items = TabItem.objects.select_related('tab', 'drink')
    
    data = []
    for item in tab_items:
        data.append([item.tab.customer.id, item.drink.id, item.quantity])
    
    df = pd.DataFrame(data, columns=['user_id', 'drink_id', 'quantity'])
    user_drink_matrix = df.pivot_table(index='user_id', columns='drink_id', values='quantity', fill_value=0)
    return user_drink_matrix

def recommend_drinks(user_id, explore_chance=0.3):
    """
    Recommend drinks with two safe choices and one exploratory option.
    """
    user_drink_matrix = get_user_drink_matrix()
    if user_id not in user_drink_matrix.index:
        return random.sample(list(Drink.objects.values_list('id', flat=True)), min(3, Drink.objects.count()))  # Random drinks if no history
    
    # Compute similarity between users
    user_similarity = cosine_similarity(user_drink_matrix)
    similarity_df = pd.DataFrame(user_similarity, index=user_drink_matrix.index, columns=user_drink_matrix.index)
    
    # Get similar users
    similar_users = similarity_df[user_id].sort_values(ascending=False)[1:6]  # Top 5 similar users
    
    # Get drinks from similar users
    drink_scores = defaultdict(int)
    for sim_user_id, similarity in similar_users.items():
        for drink_id in user_drink_matrix.columns:
            if user_drink_matrix.loc[sim_user_id, drink_id] > 0:
                drink_scores[drink_id] += similarity * user_drink_matrix.loc[sim_user_id, drink_id]
    
    # Sort drinks by score and select top 2 as safe choices
    sorted_drinks = sorted(drink_scores.items(), key=lambda x: x[1], reverse=True)
    safe_choices = [drink_id for drink_id, _ in sorted_drinks[:2]]
    
    # Exploration: Suggest a completely new drink
    all_drinks = set(Drink.objects.values_list('id', flat=True))
    tried_drinks = set(user_drink_matrix.loc[user_id].index)
    new_drinks = list(all_drinks - tried_drinks)
    exploratory_choice = random.choice(new_drinks) if new_drinks and random.random() < explore_chance else None
    
    recommended_drinks = safe_choices + ([exploratory_choice] if exploratory_choice else [])
    return recommended_drinks[:3]  # Ensure only 3 drinks are returned

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
@permission_classes([IsAuthenticated])
def recommend_next_drink(request):
    """
    API endpoint to recommend the next drink for the authenticated user.
    """
    user_id = request.user.id
    recommended_drinks = recommend_drinks(user_id)
    
    if not recommended_drinks:
        return Response({"message": "Not enough data to make recommendations."}, status=200)
    
    drinks = Drink.objects.filter(id__in=recommended_drinks)
    response_data = [{"id": drink.id, "name": drink.name, "description": drink.description, "price": str(drink.price)} for drink in drinks]
    
    return Response(response_data, status=200)
