from rest_framework import serializers
from .models import CityPopulation, ProfitableBuilding, MaintainableBuilding, \
    MassiliaSettings, ArmyUnit, NavyUnit, BalanceSheet, UniqueEvent


class CityPopulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityPopulation
        fields = ('name', 'population')


class MassiliaSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MassiliaSettings
        fields = ('turn', 'year', 'taxation', 'trade', 'polis_tributes', 'miscellaneous', 'garrison_upkeep', 'balance')


class ProfitableBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfitableBuilding
        fields = ('name', 'construction_cost', 'building_income', 'settings')


class MaintainableBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintainableBuilding
        fields = ('name', 'construction_cost', 'building_maintenance', 'settings')


class ArmyUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArmyUnit
        fields = ('name', 'recruitment_cost', 'upkeep_cost', 'units_recruited', 'raised', 'settings')


class NavyUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavyUnit
        fields = ('name', 'recruitment_cost', 'upkeep_cost', 'units_recruited', 'settings')


class BalanceSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = BalanceSheet
        fields = (
            'turn',
            'taxation',
            'trade',
            'polis_tributes',
            'miscellaneous',
            'army_upkeep',
            'navy_upkeep',
            'garrison_upkeep',
            'infrastructure_maintenance',
            'total_income',
            'total_expenses',
            'new_balance',
            'archived',
            'settings'
        )


class UniqueEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueEvent
        fields = ('name', 'event_type', 'talents', 'turn', 'expired', 'balance_sheet')
