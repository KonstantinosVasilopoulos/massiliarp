from django.db import models
from django.utils.translation import ugettext_lazy as _


class BuildingType(models.Model):
    """ Represents a building type in the city of Massilia. """
    name = models.CharField(_('Building name'), max_length=30, primary_key=True)
    construction_cost = models.DecimalField(_('Construction cost'), max_digits=5, decimal_places=2)

    class Meta:
        abstract = True
