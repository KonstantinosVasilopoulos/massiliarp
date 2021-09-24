from backend.massiliarp.models import balance_sheet
from django.db import models
from django.utils.translation import ugettext_lazy as _

from backend.massiliarp.models import BalanceSheet


class UniqueEvent(models.Model):
    """ An event that affects the balance sheet for one turn only. """
    EVENT_TYPES = (
        ('I', 'Income'),
        ('E', 'Expense'),
    )

    name = models.CharField(_('Event name'), max_length=50)
    event_type = models.CharField(_('Event type'), max_length=1, choices=EVENT_TYPES)
    talents = models.DecimalField(_('Talents'), max_length=6, max_digits=2)
    turn = models.PositiveSmallIntegerField(_('Turn'))
    expired = models.BooleanField(_('Expired'), default=False)
    balance_sheet = models.ForeignKey(BalanceSheet, on_delete=models.CASCADE, blank=True, null=True)


    def __str__(self):
        symbol = '+' if self.event_type == 'I' else '-'
        return f'{self.name.title()} for turn {self.turn}\t{symbol}{self.talents} talents'

    class Meta:
        unique_together = (('name', 'turn'),)
