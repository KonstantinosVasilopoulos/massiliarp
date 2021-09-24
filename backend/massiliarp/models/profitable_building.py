from django.db import models
from django.utils.translation import ugettext_lazy as _

from backend.massiliarp.models import BuildingType, MassiliaSettings


class ProfitableBuilding(BuildingType):
    """ A Massilian building that generates income for the state. """
    building_income = models.DecimalField(_('Income'), max_digits=4, decimal_places=2)
    settings = models.ForeignKey(MassiliaSettings, on_delete=models.CASCADE, required=True)


    def __str__(self):
        return f'{self.name.title()} +{self.building_income} talents'
