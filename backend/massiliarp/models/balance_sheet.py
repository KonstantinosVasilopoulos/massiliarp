from django.db import models
from django.utils.translation import ugettext_lazy as _

from .unique_event import UniqueEvent


class BalanceSheet(models.Model):
    """ A single turn's economic report. """
    # Primary key
    turn = models.PositiveSmallIntegerField(primary_key=True)

    # Income section
    taxation = models.DecimalField(_('Taxation'), max_digits=6, decimal_places=2)
    trade = models.DecimalField(_('Trade'), max_digits=6, decimal_places=2)
    polis_tributes = models.DecimalField(_('Polis tributes'), max_digits=6, decimal_places=2)
    miscellaneous = models.DecimalField(_('Misc.'), max_digits=5, decimal_places=2, blank=True, null=True)

    # Expenses section
    army_upkeep = models.DecimalField(_('Army upkeep'), max_digits=6, decimal_places=2, blank=True, null=True)
    navy_upkeep = models.DecimalField(_('Navy upkeep'), max_digits=6, decimal_places=2, blank=True, null=True)
    garrison_upkeep = models.DecimalField(_('Garrison upkeep'), max_digits=6, decimal_places=2)
    infrastructure_maintenance = models.DecimalField(_('Infrastructure maintenance'), max_digits=6, decimal_places=2, blank=True, null=True)
    
    # Other fields and relationships
    total_income = models.DecimalField(_('Total income'), max_digits=7, decimal_places=2, blank=True, null=True)
    total_expenses = models.DecimalField(_('Total expenses'), max_digits=7, decimal_places=2, blank=True, null=True)
    new_balance = models.DecimalField(_('New balance'), max_digits=7, decimal_places=2, blank=True, null=True)
    archived = models.BooleanField(_('Archived'), default=False)
    settings = models.ForeignKey('MassiliaSettings', on_delete=models.SET_NULL, null=True)


    def calculate_standard_income(self):
        return self.taxation + self.trade + self.polis_tributes + self.miscellaneous


    def calculate_standard_expenses(self):
        # Check the validity of the expenses variables
        if self.army_upkeep is None or self.navy_upkeep is None or self.infrastructure_maintenance is None:
            return 0.0

        return self.army_upkeep + self.navy_upkeep + self.garrison_upkeep + self.infrastructure_maintenance


    def calculate_income(self):
        unique_events_income = 0.0
        for event in UniqueEvent.objects.filter(balance_sheet=self, event_type='I', expired=False):
            unique_events_income += event.talents
            event.expired = True

        self.total_income = self.calculate_standard_income() + unique_events_income
        return self.total_income


    def calculate_expenses(self):
        unique_events_expenses = 0.0
        for event in UniqueEvent.objects.filter(balance_sheet=self, event_type='E', expired=False):
            unique_events_expenses += event.talents
            event.expired = True

        self.total_expenses = self.calculate_standard_expenses() + unique_events_expenses
        return self.total_expenses


    def calculate_new_balance(self):
        self.new_balance = self.settings.balance + self.calculate_income() - self.calculate_standard_expenses()
        return self.new_balance


    def calculate_net_difference(self):
        net_diff = self.calculate_standard_income() - self.calculate_standard_expenses()
        return (net_diff >= 0, net_diff)
