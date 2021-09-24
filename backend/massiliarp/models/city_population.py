from django.db import models
from django.utils.translation import ugettext_lazy as _


class CityPopulation(models.Model):
    """ Represents a city's population. """
    name = models.CharField(_('City name'), max_length=40, primary_key=True)
    population = models.PositiveIntegerField(_('Population'))


    def __str__(self):
        return f'{self.name.title()}: {self.population}'
