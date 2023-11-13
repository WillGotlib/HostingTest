from django.shortcuts import render
from django.http import FileResponse

from .models import Round, Movie, ScoringScheme
from .utils import SCHEME_CHOICES, SCHEME_LIST, SCHEME_DESCRIPTIONS
from .serializers import *

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer

# Create your views here.
@api_view(('GET',))
@renderer_classes((JSONRenderer, ))
def mainpage(request):
    img = open('static/test/wonka-flash.jpg', 'rb')
    return FileResponse(img)
    # return Response({"Message": "This worked"}, status=203)

class NewRoundView(APIView):
    def post(self, request):
        # form = RoundGenForm(request.data)
        # if not form.is_valid():
        #     return Response("FAILURE")
        # print(form.cleaned_data)
        sch = SCHEME_LIST[0] if request.data['scheme'] == "" else request.data['scheme']
        print(sch)
        round = Round.objects.create(size=int(request.data['size']), scheme=ScoringScheme.objects.get(pk=sch))
        print("---- NEWROUNDVIEW: Creating New Round ----")
        round.generate_movies(self.request)
        ser = RoundSerializer(round)
        return Response(ser.data)

class SchemesView(ListAPIView):
    def get(self, request):
        d = {}
        for sch in SCHEME_LIST:
            d[sch] = {'name': SCHEME_CHOICES[sch], 'description': SCHEME_DESCRIPTIONS[sch]}
        return Response({'list': SCHEME_LIST, 'dictionary': d})

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
        