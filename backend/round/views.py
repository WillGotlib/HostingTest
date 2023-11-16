from django.shortcuts import HttpResponse
from django.http import FileResponse
from django.template import loader

from .models import Round, Movie, ScoringScheme
from .utils import SCHEME_CHOICES, SCHEME_LIST, SCHEME_DESCRIPTIONS
from .serializers import *
from .forms import GuessForm

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer

# Create your views here.
@api_view(('GET',))
@renderer_classes((JSONRenderer, ))
def mainpage(request):
    if not ScoringScheme.objects.count():
        print("Nothing here. Populating")
        ret = ScoringScheme.populate()    
    # return Response({"Message": "This worked"}, status=203)
    template = loader.get_template('base.html')
    print("ghjrghkr")
    return HttpResponse(template.render({}, request))
    img = open('static/test/wonka-flash.jpg', 'rb')
    context = {'image': img}
    return Response(request, 'index.html', context=context)

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
        if round.generate_movies(self.request) < 0:
            return Response("Querying to TMDB failed. Try reloading.", status=501)
        ser = RoundSerializer(round)
        return Response(ser.data)

class SubmitGuessView(APIView):
    def add_score(self, round, index, score):
        split_list = round.scores.split(',')
        print("CONVERTED LIST: \n" + str(split_list))
        split_list[index] = str(score)
        print("MODIFIED LIST: \n" + str(split_list))
        split_list = ','.join(split_list)
        round.scores = split_list
        round.save()
    
    def post(self, request):
        form = GuessForm(request.POST)
        print("We form now!")
        if not form.is_valid(): 
            return Response("Form was invalid. Could not carry on. Remember to include guess, index, r_id, m_id", status=500)
        print("Form valid -- " + str(form.cleaned_data))
        guess = form.cleaned_data['guess']
        index = form.cleaned_data['index']
        r_id = form.cleaned_data['r_id']
        m_id = form.cleaned_data['m_id']
        print(f"Guess = {guess}, Round ID = {r_id}")
        movie = Movie.objects.get(id=m_id) # NOTE: Dumb thing which is important here: ID and TMDB_ID are not necessarily equal. Would be nice...

        score_info = {
            "guess": guess,
            "runtime": movie.runtime,
            "score": 0,
            "feedback": ""
        }

        round = Round.objects.get(id=r_id)
        score_info['score'], score_info['feedback'] = round.determine_score(guess, movie.runtime)
        self.add_score(round, index, score_info['score'])
        print("SCORE INFO", score_info)
        return Response(score_info)

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
        