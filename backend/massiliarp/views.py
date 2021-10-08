import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import viewsets
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
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
    permission_classes = [AllowAny]

    def post(self, request):
        data = json.loads(request.body)
        username = data['username']
        password = data['password']

        # Check user credentials
        if username is None or password is None:
            return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

        # Login
        login(request, user)
        return JsonResponse({'detail': 'Successfully logged in.'})


class LogoutView(APIView):
    def get(self, request):
        logout(request)
        return JsonResponse({'detail': 'Successfully logged out.'})


class CSRFView(APIView):
    def get(self, request):
        response = JsonResponse({'detail': 'CSRF cookie set.'})
        response['X-CSRFToken'] = get_token(request)
        return response


class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    @staticmethod
    @ensure_csrf_cookie
    def get(request, format=None):
        if not request.user.is_authenticated:
            return JsonResponse({'isAuthenticated': False})

        return JsonResponse({'isAuthenticated': True})


class WhoAmIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]

    @staticmethod
    def get(request, format=None):
        if not request.user.is_authenticated():
            return JsonResponse({'isAuthenticated': False})

        return JsonResponse({'username': request.user.username})
