from django.db import models

from .unit import Unit


class NavyUnit(Unit):
    """ Naval unit of Massilia. """
    settings = models.ForeignKey('MassiliaSettings', on_delete=models.CASCADE)
