from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),  # Changed from 'dashboard' to 'dashboard_view'
]