from django.urls import path
from . import views

urlpatterns = [
    path('', views.savings_list, name='savings_list'),
    path('add/', views.savings_add, name='savings_add'),
    path('edit/<int:pk>/', views.savings_edit, name='savings_edit'),
    path('delete/<int:pk>/', views.savings_delete, name='savings_delete'),
]
