import json
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
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


class IndexView(TemplateView):
    """ Return the ReactJS frontend. """
    template_name = 'build/index.html'


@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (AllowAny, )

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
        if not request.user.is_authenticated:
            return JsonResponse({'detail': 'User is not authenticated.'}, status=400)

        logout(request)
        return JsonResponse({'detail': 'Successfully logged out.'})


@method_decorator(ensure_csrf_cookie, name='dispatch')
class SessionView(APIView):
    permission_classes = (AllowAny, )
    
    def  get(self, request, format=None):
        if request.user.is_authenticated:
            return JsonResponse({'isAuthenticated': True})

        return JsonResponse({'isAuthenticated': False})


class LatestBalanceSheetView(APIView):
    """ Find the latest balance sheet and send it to the user. """
    def get(self, request, format=None):
        settings = MassiliaSettings.objects.get(pk=1)
        current_year = BalanceSheet.objects.get(year=settings.year)
        serializer = BalanceSheetSerializer(current_year)
        return JsonResponse(serializer.data, safe=False)


class YearsEventsView(ListAPIView):
    """ Get the events of a specific year. """
    serializer_class = UniqueEventSerializer

    def get_queryset(self):
        year = self.kwargs['year']
        return UniqueEvent.objects.filter(year=year)


class NetDifferenceView(APIView):
    """ Calculate and return the net difference of year's balance sheet. """
    def get(self, request, format=None, *args, **kwargs):
        year = kwargs['year']
        matched_sheets = BalanceSheet.objects.filter(year=year)
        if len(matched_sheets) > 0:
            # Calculate the net difference
            net_diff = matched_sheets[0].calculate_net_difference()
            return JsonResponse({
                'isProfit': net_diff[0],
                'netDiff': net_diff[1],
            })
        
        return JsonResponse({'detail', 'No balance sheet for such year found.'}, status=400)


class EndYearView(APIView):
    """ Progress to the next year. """
    def get(self, request, format=None):
        # Create the new balance sheet
        settings = MassiliaSettings.objects.get(pk=1)
        settings.end_year()

        # Send a positive answer back
        return JsonResponse({'details': 'Changed year successfully.'})
