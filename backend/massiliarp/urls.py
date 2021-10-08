from django.urls import path
from massiliarp import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('csrf/', views.CSRFView.as_view(), name='csrf'),
    path('session/', views.SessionView.as_view(), name='session'),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
]
