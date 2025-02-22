from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    API endpoint for logging in a user.
    Expects 'username' and 'password' in the POST data.
    Returns an authentication token.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"error": "Username and password are required."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Retrieve or create a token for the user
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"message": "Login successful.", "token": token.key},
                        status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials."},
                        status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    API endpoint for logging out a user.
    """
    logout(request)
    return Response({"message": "Logged out successfully."},
                    status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    API endpoint for registering a new user.
    Expects 'username', 'password', and optionally 'email' in the POST data.
    Returns an authentication token.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    
    if not username or not password:
        return Response({"error": "Username and password are required."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    # Create a token for the new user
    token = Token.objects.create(user=user)
    return Response({"message": "User created successfully.", "token": token.key},
                    status=status.HTTP_201_CREATED)
