from django.urls import path
from . import views

urlpatterns = [
    path('recommendations/', views.get_recommendations, name='get_recommendations'),
    path('courses/', views.get_all_courses, name='get_all_courses'),
]