from django.shortcuts import render
from .models import Round, Movie, ScoringScheme
from django.http import FileResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer

# Create your views here.
@api_view(('GET',))
@renderer_classes((JSONRenderer, ))
def mainpage(request):
    img = open('runtimer/static/test/wonka-flash.jpg', 'rb')
    return FileResponse(img)
    # return Response({"Message": "This worked"}, status=203)

class SchemesLoadUtilityView(APIView):
    def get(self, request):
        ret = ScoringScheme.populate()
        if ret == 1:
            return Response("Loaded Scoring Schemes into Database successfully")
        elif ret == 2:
            return Response("Scoring Schemes Confirmed In Database")
        else:
            return Response("FAILURE Loading Scoring Schemes")


class DeleteUtilityView(APIView):
    def get(self, request):
        Round.objects.all().delete()
        Movie.objects.all().delete()
        return Response("Deleted all Round, Movie and Guess objects.")
        