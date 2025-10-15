from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.viewsets.userviewsets import userviewsets
from core.viewsets.autor_view import AutorViewSet
from core.viewsets.libro_view import LibroViewSet

router = DefaultRouter()
router.register(r'autores', AutorViewSet)
router.register(r'libros', LibroViewSet)

urlpatterns = [
    path('api/login/', userviewsets.as_view(), name='login'),
    path('api/', include(router.urls)), 
]
