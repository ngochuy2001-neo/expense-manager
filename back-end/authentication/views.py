from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer


def _normalize_register_data(data):
    """Chấp nhận cả camelCase (firstName, lastName) và snake_case (first_name, last_name)."""
    data = dict(data)
    if 'firstName' in data and 'first_name' not in data:
        data['first_name'] = data.pop('firstName', '')
    if 'lastName' in data and 'last_name' not in data:
        data['last_name'] = data.pop('lastName', '')
    return data


def _safe_print_data(data, prefix=""):
    """In ra dữ liệu để debug, ẩn password."""
    d = dict(data)
    if 'password' in d:
        d = {**d, 'password': '***'}
    print(f"[Register API] {prefix} request.data keys: {list(d.keys())}")
    print(f"[Register API] {prefix} request.data: {d}")


@swagger_auto_schema(
    method="post",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["username", "password", "first_name", "last_name"],
        properties={
            "username": openapi.Schema(type=openapi.TYPE_STRING, description="Tên đăng nhập"),
            "password": openapi.Schema(type=openapi.TYPE_STRING, description="Mật khẩu (tối thiểu 6 ký tự)"),
            "first_name": openapi.Schema(type=openapi.TYPE_STRING, description="Họ và tên"),
            "last_name": openapi.Schema(type=openapi.TYPE_STRING, description="Họ (hoặc Guest)"),
            "email": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL, description="Email (bắt buộc nếu không có phoneNumber)"),
            "phoneNumber": openapi.Schema(type=openapi.TYPE_STRING, description="Số điện thoại 10-11 chữ số (bắt buộc nếu không có email)"),
        },
    ),
    responses={
        201: openapi.Response("Đăng ký thành công", openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "user": openapi.Schema(type=openapi.TYPE_OBJECT),
                "access": openapi.Schema(type=openapi.TYPE_STRING),
                "refresh": openapi.Schema(type=openapi.TYPE_STRING),
                "message": openapi.Schema(type=openapi.TYPE_STRING),
            },
        )),
        400: "Dữ liệu không hợp lệ",
    },
)
@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    """
    API endpoint cho đăng ký người dùng mới
    POST /auth/register/
    Nhận first_name, last_name (snake_case) hoặc firstName, lastName (camelCase).
    """
    _safe_print_data(request.data, "Raw")
    data = _normalize_register_data(request.data)
    _safe_print_data(data, "Normalized")
    serializer = RegisterSerializer(data=data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Tạo JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Trả về response với user info và tokens
        user_serializer = UserSerializer(user)
        return Response({
            'user': user_serializer.data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Đăng ký thành công'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method="post",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["username", "password"],
        properties={
            "username": openapi.Schema(type=openapi.TYPE_STRING, description="Tên đăng nhập"),
            "password": openapi.Schema(type=openapi.TYPE_STRING, description="Mật khẩu"),
        },
    ),
    responses={
        200: openapi.Response("Đăng nhập thành công", openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "user": openapi.Schema(type=openapi.TYPE_OBJECT),
                "access": openapi.Schema(type=openapi.TYPE_STRING),
                "refresh": openapi.Schema(type=openapi.TYPE_STRING),
                "message": openapi.Schema(type=openapi.TYPE_STRING),
            },
        )),
        400: "Tên đăng nhập hoặc mật khẩu không đúng",
    },
)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """
    API endpoint cho đăng nhập bằng username
    POST /auth/login/
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Tạo JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Trả về response với user info và tokens
        user_serializer = UserSerializer(user)
        return Response({
            'user': user_serializer.data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Đăng nhập thành công'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
