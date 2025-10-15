from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from core.models.modelUser import User

class userSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    username = serializers.CharField(read_only=True)

    def validate(self, attrs):
        email_or_username = attrs.get("email")
        password = attrs.get("password")

        user = (
            User.objects.filter(
                Q(email__iexact=email_or_username) | Q(username__iexact=email_or_username)
            )
            .only("id", "username", "email", "role", "password", "is_active")
            .first()
        )

        if not user or not user.check_password(password) or not user.is_active:
            raise serializers.ValidationError("Credenciales inválidas")

        refresh = RefreshToken.for_user(user)

        return {
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
