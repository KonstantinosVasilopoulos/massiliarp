from django.urls import path
from massiliarp import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('session/', views.SessionView.as_view(), name='session'),
]
