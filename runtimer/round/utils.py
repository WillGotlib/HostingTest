import math
import runtimer.variables as vars

# SCORE CALCULATORS

# Create your models here.
STANDARD = 'SND'
GOLF = 'GLF'
LENIENT = 'LEN'
STRICT = 'STR'

SCHEME_LIST = [ # Redundant but important for ORDERING!!!! So really it is beautiful design
    STANDARD,
    GOLF,
    LENIENT,
    STRICT
]

lenient_threshold = 10 # Lenient System Threshold: within 10 minutes you get full score
lenient_max_error = 25 # How many minutes off in addition to the threshold to get 0 points. Falloff goes linearly

SCHEME_CHOICES = {
    STANDARD: 'Standard',
    GOLF: 'Golf',
    LENIENT: 'Lenient',
    STRICT: 'Strict',
}

SCHEME_DESCRIPTIONS = {
    STANDARD: 'Scores your guess on an adjusted bell curve compared to the answer.',
    GOLF: 'Score is plain difference in minutes. Lower collective score is better!',
    LENIENT: f'More forgiving than standard. Full points within {lenient_threshold} minutes.',
    STRICT: 'Most demanding - full points for a correct guess, none for anything else.',
}

# Different methods of scoring.
# TODO currently all of the scoring systems except GOLF are normalized between 10 and 0, with 10 being a full-on success.
# Make it more flexible? Although is there a point?

# Guess: [INT] The player's guess
# Truth: [INT] The ground truth/real runtime which they're trying to guess
# Extra: [DICT] A Dictionary of any other fields we might want...included for future flexibility.

def score_standard(guess, truth, extra):
    x = abs(guess - truth)/(truth / 10)
    return vars.CORRECT_SCORE * math.exp(-math.pow(x, 2))

def score_golf(guess, truth, extra):
    return abs(guess - truth)

def score_lenient(guess, truth, extra):
    diff = abs(guess - truth)
    if diff <= lenient_threshold: 
        return vars.CORRECT_SCORE
    return math.max(0, (vars.CORRECT_SCORE/lenient_max_error)*(diff - lenient_threshold) + 10)

def score_strict(guess, truth, extra):
    return 10 if guess == truth else 0
                
    
SCHEME_SCORERS = {
    STANDARD: score_standard,
    GOLF: score_golf,
    LENIENT: score_lenient,
    STRICT: score_strict
}

