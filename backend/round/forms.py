from django import forms
from .models import RoundGuess
from .utils import SCHEME_LIST, SCHEME_CHOICES

class GuessForm(forms.Form):
    r_id = forms.IntegerField()
    m_id = forms.IntegerField()
    index = forms.IntegerField()
    guess = forms.IntegerField(label="Guess the Runtime")
    class Meta:
        model = RoundGuess
        fields = ['guess']

class RoundGenForm(forms.Form):
    size = forms.IntegerField()
    scheme = forms.ChoiceField(choices=[(scheme, SCHEME_CHOICES[scheme]) for scheme in SCHEME_LIST])