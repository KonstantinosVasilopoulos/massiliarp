from django.db import models
from django.utils.translation import ugettext_lazy as _

from .unit import Unit


class ArmyUnit(Unit):
    """ Represents a land unit type(e.g. hoplite). """
    raised = models.BooleanField(_('Raised'), default=False)
    settings = models.ForeignKey('MassiliaSettings', on_delete=models.CASCADE)
