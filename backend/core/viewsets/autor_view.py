from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from core.models.autor import Autor
from core.serializers.autor_serializer import AutorSerializer

class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    parser_classes = (MultiPartParser, FormParser)
