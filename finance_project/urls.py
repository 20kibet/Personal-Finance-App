from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include(('accounts.urls', 'accounts'), namespace='accounts')),
    path('dashboard/', include('dashboard.urls')),
    path('', include('dashboard.urls')),  # This makes root URL go to dashboard
    path('income/', include('income.urls')),
    path('expenses/', include('expenses.urls')),
    path('budgets/', include('budgets.urls')),
    path('savings/', include('savings.urls')),
    path('reports/', include('reports.urls')),
    path('admin-panel/', include('admin_dashboard.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)