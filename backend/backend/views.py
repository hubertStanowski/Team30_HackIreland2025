from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render

def dashboard_view(request):
    return render(request, '/Users/timothytay/Desktop/team30/Team30_HackIreland2025/backend/backend/dashboard.html')

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    API endpoint for changing a user's password.
    Expects 'old_password' and 'new_password' in the POST data.
    """
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response({"error": "Old password and new password are required."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=request.user.username, password=old_password)
    if user is not None:
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully."},
                        status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid password."},
                        status=status.HTTP_400_BAD_REQUEST)

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    """
    API endpoint for retrieving user information.
    Requires authentication.
    """
    user = request.user
    return Response({"username": user.username, "email": user.email},
                    status=status.HTTP_200_OK)