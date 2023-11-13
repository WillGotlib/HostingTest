from rest_framework import serializers
from round.models import Round, Movie, RoundGuess

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class RoundSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True)
    class Meta:
        model = Round
        fields = '__all__'

class GuessSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoundGuess
        fields = ['guess_id', 'guess']
