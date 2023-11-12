from django.urls import path
from . import views

urlpatterns = [
    path('', views.mainpage, name='Main Game Page'),
    
    path('schemes/load/', views.SchemesLoadUtilityView.as_view(), name='loadSchemes'),
    path('delete/', views.DeleteUtilityView.as_view(), name='delete'),
]