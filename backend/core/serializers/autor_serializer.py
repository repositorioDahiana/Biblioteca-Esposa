from rest_framework import serializers
from core.models.autor import Autor

class AutorSerializer(serializers.ModelSerializer):
    foto_url = serializers.SerializerMethodField(read_only=True)

    def get_foto_url(self, obj):
        if hasattr(obj, "foto") and obj.foto:
            try:
                # CloudinaryField devuelve un objeto con .url
                return obj.foto.url
            except Exception:
                return None
        return None

    class Meta:
        model = Autor
        fields = ['id', 'nombre', 'apellido', 'nacionalidad', 'fecha_nacimiento', 'biografia', 'foto', 'foto_url']
