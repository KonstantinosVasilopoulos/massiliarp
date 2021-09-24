from django.db import models
from django.utils.translation import ugettext_lazy as _


class Unit(models.Model):
    """ An abstract class for land or naval unit. """
    name = models.CharField(_('Building name'), max_length=25, primary_key=True)
    recruitment_cost = models.DecimalField(_('Recruitment cost'), max_digits=4, decimal_places=2)
    upkeep_cost = models.DecimalField(_('Unit upkeep'), max_digits=4, decimal_places=2)
    units_recruited = models.PositiveIntegerField(_('Units recruited'))


    def __str__(self):
        return f'{self.name.title()} - {self.units_recruited}'

    class Meta:
        abstract = True
