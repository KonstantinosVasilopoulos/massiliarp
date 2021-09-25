from rest_framework import viewsets
from .serializers import CityPopulationSerializer, ProfitableBuildingSerializer, \
    MaintainableBuildingSerializer, MassiliaSettingsSerializer, ArmyUnitSerializer, \
    NavyUnitSerializer, BalanceSheetSerializer, UniqueEventSerializer
from .models import CityPopulation, ProfitableBuilding, MaintainableBuilding, \
    MassiliaSettings, ArmyUnit, NavyUnit, BalanceSheet, UniqueEvent


class CityPopulationView(viewsets.ModelViewSet):
    serializer_class = CityPopulationSerializer
    queryset = CityPopulation.objects.all()


class MassiliaSettingsView(viewsets.ModelViewSet):
    serializer_class = MassiliaSettingsSerializer
    queryset = MassiliaSettings.objects.filter(pk=1)


class ProfitableBuildingView(viewsets.ModelViewSet):
    serializer_class = ProfitableBuildingSerializer
    queryset = ProfitableBuilding.objects.all()


class MaintainableBuildingView(viewsets.ModelViewSet):
    serializer_class = MaintainableBuildingSerializer
    queryset = MaintainableBuilding.objects.all()


class ArmyUnitView(viewsets.ModelViewSet):
    serializer_class = ArmyUnitSerializer
    queryset = ArmyUnit.objects.all()


class NavyUnitView(viewsets.ModelViewSet):
    serializer_class = NavyUnitSerializer
    queryset = NavyUnit.objects.all()


class BalanceSheetView(viewsets.ModelViewSet):
    serializer_class = BalanceSheetSerializer
    queryset = BalanceSheet.objects.all()


class UniqueEventView(viewsets.ModelViewSet):
    serializer_class = UniqueEventSerializer
    queryset = UniqueEvent.objects.all()
