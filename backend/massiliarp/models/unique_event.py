from django.db import models
from django.utils.translation import ugettext_lazy as _


class UniqueEvent(models.Model):
    """ An event that affects the balance sheet for one year only. """
    EVENT_TYPES = (
        ('I', 'Income'),
        ('E', 'Expense'),
    )

    name = models.CharField(_('Event name'), max_length=50)
    event_type = models.CharField(_('Event type'), max_length=1, choices=EVENT_TYPES)
    talents = models.DecimalField(_('Talents'), max_digits=6, decimal_places=2)
    year = models.PositiveSmallIntegerField(_('Year'))
    expired = models.BooleanField(_('Expired'), default=False)
    balance_sheet = models.ForeignKey('BalanceSheet', on_delete=models.CASCADE, blank=True, null=True)


    def __str__(self):
        symbol = '+' if self.event_type == 'I' else '-'
        return f'{self.name.title()} for year {self.year}\t{symbol}{self.talents} talents'

    class Meta:
        unique_together = (('name', 'year'),)
