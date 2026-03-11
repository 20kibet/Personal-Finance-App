from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_dashboard, name='admin_dashboard'),
    path('user/<int:user_id>/', views.user_detail, name='admin_user_detail'),
]