from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'accounts'

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('password/', auth_views.PasswordChangeView.as_view(
        template_name='accounts/change_password.html'), name='password_change'),
    path('password/done/', auth_views.PasswordChangeDoneView.as_view(),
        name='password_change_done'),
]