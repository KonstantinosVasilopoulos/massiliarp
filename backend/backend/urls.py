"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from massiliarp import views


router = routers.DefaultRouter()
router.register(r'city-population', views.CityPopulationView)
router.register(r'massilia-settings', views.MassiliaSettingsView)
router.register(r'profitable-building', views.ProfitableBuildingView)
router.register(r'maintainable-building', views.MaintainableBuildingView)
router.register(r'army-unit', views.ArmyUnitView)
router.register(r'navy-unit', views.NavyUnitView)
router.register(r'balance-sheet', views.BalanceSheetView)
router.register(r'unique-event', views.UniqueEventView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/latest-balance-sheet/', views.LatestBalanceSheetView.as_view()),
    path('api/years-events/<int:year>/', views.YearsEventsView.as_view()),
    path('api/net-diff/<int:year>/', views.NetDifferenceView.as_view()),
    path('api/end-year/', views.EndYearView.as_view()),
    path('api-auth/', include('massiliarp.urls')),
    path('', views.IndexView.as_view()),
]
