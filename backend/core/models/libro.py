from django.db import models
from cloudinary.models import CloudinaryField
from cloudinary_storage.storage import RawMediaCloudinaryStorage
from core.models.autor import Autor

class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.ForeignKey(Autor, related_name='libros', on_delete=models.CASCADE)
    editorial = models.CharField(max_length=200)
    anio_publicacion = models.PositiveIntegerField()
    isbn = models.CharField(max_length=20, unique=True)
    categoria = models.CharField(max_length=100)
    idioma = models.CharField(max_length=50)
    numero_ejemplares = models.PositiveIntegerField(default=1)
    genero = models.CharField(max_length=100)
    numero_paginas = models.PositiveIntegerField()
    sinopsis = models.TextField(null=True, blank=True)
    serie = models.CharField(max_length=100, null=True, blank=True)

    # Nuevos:
    portada = CloudinaryField("image", null=True, blank=True)
    archivo_pdf = models.FileField(
        storage=RawMediaCloudinaryStorage(),  
        upload_to="libros/pdfs/",        
        null=True,
        blank=True
    )

    def __str__(self):
        return self.titulo
