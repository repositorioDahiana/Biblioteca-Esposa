from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from core.models.modelUser import User

class userSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    username = serializers.CharField(read_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Credenciales inválidas")

        if not user.check_password(password):
            raise serializers.ValidationError("Credenciales inválidas")

        refresh = RefreshToken.for_user(user)

        return {
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
