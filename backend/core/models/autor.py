from django.db import models
from cloudinary.models import CloudinaryField

class Autor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    nacionalidad = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    biografia = models.TextField(null=True, blank=True)
    # Nueva: foto del autor
    foto = CloudinaryField("image", null=True, blank=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
