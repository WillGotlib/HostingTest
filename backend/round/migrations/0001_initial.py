# Generated by Django 4.2.7 on 2023-11-12 21:21

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import re


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.IntegerField(unique=True)),
                ('title', models.CharField(max_length=1000, verbose_name='Film Title')),
                ('year', models.CharField(default=-1, max_length=4, verbose_name='Release Year')),
                ('runtime', models.IntegerField()),
                ('poster_path', models.CharField(default='/', max_length=200)),
                ('backdrop_path', models.CharField(default='/', max_length=200)),
            ],
            options={
                'verbose_name': 'Movie',
            },
        ),
        migrations.CreateModel(
            name='Round',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('size', models.IntegerField(default=5)),
                ('scores', models.CharField(max_length=400, validators=[django.core.validators.RegexValidator(re.compile('^\\d+(?:,\\d+)*\\Z'), code='invalid', message='Enter only digits separated by commas.')])),
            ],
            options={
                'verbose_name': 'Game Round',
            },
        ),
        migrations.CreateModel(
            name='ScoringScheme',
            fields=[
                ('short', models.CharField(default='XYZ', max_length=3, primary_key=True, serialize=False)),
                ('name', models.CharField(default='NO NAME', max_length=100)),
                ('description', models.CharField(default='No Description', max_length=1000)),
                ('lower_better', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='RoundGuess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guess', models.IntegerField(default=-1)),
                ('individual_score', models.FloatField(default=-1.0)),
                ('Movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='round.movie')),
                ('Round', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='round.round')),
            ],
            options={
                'verbose_name': 'Round Guess',
            },
        ),
        migrations.AddField(
            model_name='round',
            name='movies',
            field=models.ManyToManyField(through='round.RoundGuess', to='round.movie'),
        ),
        migrations.AddField(
            model_name='round',
            name='scheme',
            field=models.ForeignKey(default='SND', on_delete=django.db.models.deletion.CASCADE, to='round.scoringscheme'),
        ),
    ]