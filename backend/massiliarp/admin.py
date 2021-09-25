from django.contrib import admin
from .models import BalanceSheet, MassiliaSettings, CityPopulation, ProfitableBuilding, \
    MaintainableBuilding, ArmyUnit, NavyUnit, UniqueEvent


admin.site.register(BalanceSheet)
admin.site.register(MassiliaSettings)
admin.site.register(CityPopulation)
admin.site.register(ProfitableBuilding)
admin.site.register(MaintainableBuilding)
admin.site.register(ArmyUnit)
admin.site.register(NavyUnit)
admin.site.register(UniqueEvent)
