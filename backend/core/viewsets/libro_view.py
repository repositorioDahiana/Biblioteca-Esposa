from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from core.models.libro import Libro
from core.serializers.libro_serializer import LibroSerializer

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    parser_classes = (MultiPartParser, FormParser)
