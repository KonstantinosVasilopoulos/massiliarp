from decimal import Decimal
from django.db import models
from django.utils.translation import ugettext_lazy as _

from .profitable_building import ProfitableBuilding
from .maintainable_building import MaintainableBuilding
from .army_unit import ArmyUnit
from .navy_unit import NavyUnit
from .balance_sheet import BalanceSheet

class SingletonModel(models.Model):

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SingletonModel, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class MassiliaSettings(SingletonModel):
    """ Singleton object that holds important game data. """
    turn = models.PositiveSmallIntegerField(_('Turn'))
    year = models.PositiveSmallIntegerField(_('Year'))
    taxation = models.DecimalField(_('Taxation'), max_digits=6, decimal_places=2)
    trade = models.DecimalField(_('Trade'), max_digits=6, decimal_places=2)
    polis_tributes = models.DecimalField(_('Polis tributes'), max_digits=6, decimal_places=2)
    miscellaneous = models.DecimalField(_('Misc.'), max_digits=5, decimal_places=2)
    garrison_upkeep = models.DecimalField(_('Garrison upkeep'), max_digits=6, decimal_places=2)
    balance = models.DecimalField(_('Balance'), max_digits=7, decimal_places=2)


    def end_year(self):
        # Find the next balance sheet or create a new one if needed
        next_balance_sheet_query_set = BalanceSheet.objects.filter(year=self.year-1)
        if len(next_balance_sheet_query_set) > 0:
            new_balance_sheet = next_balance_sheet_query_set[0]

            # Re-enter the values in case the settings have been altered
            new_balance_sheet.taxation = self.taxation
            new_balance_sheet.trade = self.trade
            new_balance_sheet.polis_tributes = self.polis_tributes
            new_balance_sheet.miscellaneous = self.miscellaneous
            new_balance_sheet.garrison_upkeep = self.garrison_upkeep
            
        else:
            new_balance_sheet = BalanceSheet(
                year=self.year-1,
                taxation=self.taxation,
                trade=self.trade,
                polis_tributes=self.polis_tributes,
                miscellaneous=self.miscellaneous,
                garrison_upkeep=self.garrison_upkeep,
                settings=self
            )

        # Calculate and store income section
        new_balance_sheet.calculate_income()

        # Calculate and store the expenses section
        new_balance_sheet.army_upkeep = self.calculate_army_upkeep()
        new_balance_sheet.navy_upkeep = self.calculate_navy_upkeep()
        new_balance_sheet.infrastructure_maintenance = self.calculate_maintenance()
        new_balance_sheet.calculate_income()
        new_balance_sheet.calculate_expenses()

        # Calculate the new balance
        self.balance = new_balance_sheet.calculate_new_balance()

        # Save the new balance sheet
        new_balance_sheet.save()

        # Archive the previous balance sheet
        current_balance_sheet = BalanceSheet.objects.get(year=self.year)
        current_balance_sheet.archived = True

        # Change turn & year
        self.turn += 2
        self.year -= 1
        self.save()

        # Create the next year's empty sheet
        next_balance_sheet = BalanceSheet(
            year=self.year-1,
            taxation=self.taxation,
            trade=self.trade,
            polis_tributes=self.polis_tributes,
            miscellaneous=self.miscellaneous,
            garrison_upkeep=self.garrison_upkeep,
            settings=self
        )
        next_balance_sheet.save()


    def calculate_maintenance(self):
        maintenance = Decimal(0)
        for building in MaintainableBuilding.objects.filter(settings=self):
            maintenance += building.building_maintenance * building.number_built

        return maintenance


    def calculate_building_income(self):
        # Building income is calculated once per 2 turns
        if self.turn % 2 != 0:
            return Decimal(0)

        income = Decimal(0)
        for building in ProfitableBuilding.objects.filter(settings=self):
            income += building.building_income

        return income


    def calculate_army_upkeep(self):
        upkeep = Decimal(0)

        # Only raised units require upkeep
        for unit in ArmyUnit.objects.filter(settings=self, raised=True):
            upkeep += unit.units_recruited * unit.upkeep_cost

        return upkeep


    def calculate_navy_upkeep(self):
        upkeep = Decimal(0)
        for unit in NavyUnit.objects.filter(settings=self):
            upkeep += unit.units_recruited * unit.upkeep_cost

        return upkeep
