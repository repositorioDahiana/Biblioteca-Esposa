from rest_framework import serializers
from core.models.libro import Libro
from core.serializers.autor_serializer import AutorSerializer

class LibroSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.CharField(source='autor.nombre', read_only=True)
    autor_apellido = serializers.CharField(source='autor.apellido', read_only=True)
    portada_url = serializers.SerializerMethodField(read_only=True)
    archivo_pdf_url = serializers.SerializerMethodField(read_only=True)

    def get_portada_url(self, obj):
        if hasattr(obj, "portada") and obj.portada:
            try:
                return obj.portada.url
            except Exception:
                return None
        return None

    def get_archivo_pdf_url(self, obj):
        if hasattr(obj, "archivo_pdf") and obj.archivo_pdf:
            try:
                url = obj.archivo_pdf.url
                return url
            except Exception:
                return None
        return None
    
    class Meta:
        model = Libro
        fields = '__all__'
