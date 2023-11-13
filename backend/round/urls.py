from django.urls import path
from . import views

urlpatterns = [
    path('', views.mainpage, name='Main Game Page'),
    path('guess/', views.SubmitGuessView.as_view(), name='index'),
    path('generate/', views.NewRoundView.as_view(), name='index'),
    path('schemes/', views.SchemesView.as_view(), name='schemes'),
    path('schemes/load/', views.SchemesLoadUtilityView.as_view(), name='loadSchemes'),
    path('delete/', views.DeleteUtilityView.as_view(), name='delete'),
]