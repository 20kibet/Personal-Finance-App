from django.urls import path
from . import views

urlpatterns = [
    path('', views.budget_list, name='budget_list'),
    path('add/', views.budget_add, name='budget_add'),
    path('delete/<int:pk>/', views.budget_delete, name='budget_delete'),
]
