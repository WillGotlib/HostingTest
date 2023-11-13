from django.db import models
from django.core.validators import validate_comma_separated_integer_list
from .utils import STANDARD, SCHEME_LIST, SCHEME_CHOICES, SCHEME_SCORERS, SCHEME_DESCRIPTIONS
import runtimer.variables as vars


import random
import requests

# Create your models here.
class Movie(models.Model):
    class Meta:
        verbose_name = "Movie"
    def __str__(self):
        return "[" + str(self.tmdb_id) + "] " + self.title + " (" + str(self.runtime) + "m)"

    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=1000, verbose_name="Film Title")
    year = models.CharField(max_length=4, verbose_name="Release Year", default=-1)
    runtime = models.IntegerField()
    poster_path = models.CharField(max_length=200, default="/")
    backdrop_path = models.CharField(max_length=200, default="/")

    # Check if movie is eligible to be included in the game. 
    # Designed to work with TMDB's API v3.
    # TODO: Should this even be here?
    def movie_eligible(movie):
        return (movie['status'] == "Released" and           # The movie has to actually be out.
                movie['release_date'] != "" and             # Must have a release date. May be a little redundant but we need the year.
                movie['backdrop_path'] is not None and      # Needs to have a backdrop image. This should cut out a lot of shit
                movie['poster_path'] is not None and        # Needs to have a poster
                movie['title'] != "" and                    # Needs to have a title (although idk what wouldn't)
                movie['runtime'] > vars.MOVIE_RUNTIME_THRESHOLD # Needs to have a runtime over the given threshold
            )
        

class ScoringScheme(models.Model):
    def __str__(self) -> str:
        return self.name

    short = models.CharField(max_length=3, default="XYZ", primary_key=True)
    name = models.CharField(max_length=100, default="NO NAME")
    description = models.CharField(max_length=1000, default="No Description")
    lower_better = models.BooleanField(default=False)

    def populate():
        for sch in SCHEME_LIST:
            if len(ScoringScheme.objects.filter(pk=sch)) > 0: continue
            scheme = ScoringScheme(short=sch, name=SCHEME_CHOICES[sch], description=SCHEME_DESCRIPTIONS[sch])
            if sch == "GLF": scheme.lower_better = True
            scheme.save()
        return 1

    def score(self, guess, truth):
        def truncate_float(float_number, decimal_places):
            multiplier = 10 ** decimal_places
            return int(float_number * multiplier) / multiplier
        return truncate_float(SCHEME_SCORERS[self.short](guess, truth, {}), 1)

class Round(models.Model):
    class Meta:
        verbose_name = "Game Round"
    def __str__(self):
        return "Round " + str(self.id) + ", " + str(self.scheme) + " scored"

    size = models.IntegerField(default=5)
    scores = models.CharField(max_length=400, validators=[validate_comma_separated_integer_list])
    movies = models.ManyToManyField(
        Movie,
        through="RoundGuess",
        through_fields=("Round", "Movie")
    )
    scheme = models.ForeignKey(ScoringScheme, on_delete=models.CASCADE, to_field="short", default=SCHEME_LIST[0]) # Assuming SCHEME_LIST[0] is STD

    def generate_movies(self, request):
        scores_temp = ""
        for i in range(self.size):
            if i > 0:
                scores_temp = scores_temp + ", "
            scores_temp = scores_temp + "0"
        self.scores = scores_temp
        print("SCORES: " +self.scores)

        # Movie.clear_movies(self)
        print("GENERATION START: SIZE = " + str(self.size) + "\n")
        for i in range(self.size):
            print("\ti = " + str(i) + "\n")
            x = None
            pass_ind = False
            print(Movie)
            while (not pass_ind):  
                sample_number = random.randrange(vars.RANGE_LOW, vars.RANGE_HIGH)
                print(Movie.objects)
                
                new_movie = None
                if not Movie.objects.filter(tmdb_id=sample_number):  # This movie is not already in the database. Let's query...     
                    print("\tAttempting to ask TMDB for movie #" + str(sample_number))
                    x = requests.get('https://api.themoviedb.org/3/movie/' + str(sample_number) + '?api_key=' + vars.key)
                    if (x is None or x.status_code == 404):
                        continue
                    j = x.json()
                    assert j['id'] == sample_number
                    # Check if the movie is eligable for inclusion
                    if not Movie.movie_eligible(j):
                        continue
                    # Create a new movie object which we will potentially save to the database.
                    new_movie = Movie(tmdb_id=sample_number, title=j['title'], year=j['release_date'][:4],
                                        runtime=j['runtime'], poster_path=j['poster_path'], backdrop_path=j['backdrop_path'])
                    new_movie.save()
                    print("\tSaved a new Movie object to the database.")
                else:
                    new_movie = Movie.objects.get(tmdb_id=sample_number)
                print("\tRetrived Successfully: " + str(Movie.objects.get(tmdb_id=sample_number)))
                self.movies.add(new_movie)
                pass_ind = True
        self.save()

    # RETURNS (score, feedback)
    #       score -> a float number between 0 and vars.CORRECT_SCORE
    #       feedback -> string of feedback re: how they did
    def determine_score(self, guess, truth):
        score = self.scheme.score(guess, truth)
        feedback = ""
        # TODO: Make this change for GOLF system or any system tagged lower-is-better. Right now it says "too bad" if you get a perfect guess.
        if score >= 10 or self.scheme.lower_better and score == 0: feedback = "Perfect!"
        elif 8 <= score < 10 or self.scheme.lower_better and score < 5: feedback = "Great job!"
        elif 5 <= score < 8 or self.scheme.lower_better and score < 15: feedback = "Solid!"
        else: feedback = "Better luck next time!"
        return score, feedback

class RoundGuess(models.Model):
    class Meta:
        verbose_name = "Round Guess"
    def __str__(self):
        guessTemp = "Unguessed" if self.guess != -1 else str(self.guess)
        scoreTemp = "N/A" if self.individual_score != -1.0 else str(self.individual_score)
        return f"[{self.id}] " + "GUESS: " + str(self.Round) + ", Movie " + str(self.Movie.title) + ", Guess = " + guessTemp + ", Score = " + scoreTemp
    Round = models.ForeignKey(Round, on_delete=models.CASCADE)
    Movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    guess = models.IntegerField(default=-1) # -1 means no guess
    individual_score = models.FloatField(default=-1.0)