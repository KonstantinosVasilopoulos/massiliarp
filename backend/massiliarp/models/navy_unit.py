from django.db import models

from backend.massiliarp.models import Unit, MassiliaSettings


class NavyUnit(Unit):
    """ Naval unit of Massilia. """
    settings = models.ForeignKey(MassiliaSettings, on_delete=models.SET_NULL, required=True)
