from django.contrib.auth import authenticate
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
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


class LoginView(APIView):
    """ The homepage of the app which serves as a login page. """
    permission_classes = [AllowAny]

    def post(self, request):
        # Find the user and authenticate the user
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)

        # Make sure that the user exists
        ERROR_RESPONSE = Response({
            'message': 'failure'
        })
        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        return Response({
            'message': 'success'
        })
