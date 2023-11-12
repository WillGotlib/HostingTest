from django.urls import path
from . import views

urlpatterns = [
    path('', views.mainpage, name='Main Game Page'),
]