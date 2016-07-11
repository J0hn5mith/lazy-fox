from django.conf.urls import url
from . import views

urlpatterns = [
        url(r'predict/', views.predict),
        url(r'learn/', views.learn)
        ]
