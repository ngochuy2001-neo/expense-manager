from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer cho đăng ký người dùng mới. Nhận first_name, last_name như bình thường."""
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'phoneNumber')
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'email': {'required': False, 'allow_blank': True},
            'phoneNumber': {'required': False, 'allow_blank': True},
        }
    
    def validate(self, attrs):
        """Validation: Phải có ít nhất một trong hai (email hoặc phoneNumber)"""
        email = attrs.get('email', '').strip() if attrs.get('email') else ''
        phone_number = attrs.get('phoneNumber', '').strip() if attrs.get('phoneNumber') else ''
        
        if not email and not phone_number:
            raise serializers.ValidationError(
                "Phải có ít nhất một trong hai: email hoặc số điện thoại"
            )
        
        # Validate email format nếu có
        if email:
            from django.core.validators import validate_email
            from django.core.exceptions import ValidationError
            try:
                validate_email(email)
            except ValidationError:
                raise serializers.ValidationError({"email": "Email không hợp lệ"})
        
        # Validate phone number format nếu có (10-11 chữ số)
        if phone_number and not phone_number.isdigit():
            raise serializers.ValidationError(
                {"phoneNumber": "Số điện thoại chỉ được chứa chữ số"}
            )
        if phone_number and len(phone_number) not in [10, 11]:
            raise serializers.ValidationError(
                {"phoneNumber": "Số điện thoại phải có 10-11 chữ số"}
            )
        
        return attrs
    
    def create(self, validated_data):
        """Tạo user mới với password được hash."""
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer cho đăng nhập bằng username"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError(
                    "Tên người dùng hoặc mật khẩu không đúng"
                )
            if not user.is_active:
                raise serializers.ValidationError("Tài khoản đã bị vô hiệu hóa")
            attrs['user'] = user
        else:
            raise serializers.ValidationError("Vui lòng nhập tên người dùng và mật khẩu")
        
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer để trả về thông tin user"""
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'phoneNumber')
        read_only_fields = ('id', 'username')
