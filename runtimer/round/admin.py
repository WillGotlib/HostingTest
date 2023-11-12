from django.contrib import admin
from .models import Movie, Round, RoundGuess, ScoringScheme

# Register your models here.

@admin.register(Movie)
class Movie(admin.ModelAdmin):
    pass

class MoviesInline(admin.TabularInline):
    model = Round.movies.through

@admin.register(ScoringScheme)
class ScoringScheme(admin.ModelAdmin):
    pass

@admin.register(Round)
class Round(admin.ModelAdmin):
    model = Round
    inlines = [
        MoviesInline,
    ]

@admin.register(RoundGuess)
class RoundGuess(admin.ModelAdmin):
    pass