'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT;
// const WEATHER = require('./data/weather.json');
const superagent = require('superagent');

function Forecast(dailyForecast) {
  this.date = dailyForecast.datetime;
  this.description = dailyForecast.weather.description;
}

function Movie(movie) {
  this.title = movie.title;
  this.description = movie.overview;
}

app.get('/weather', (request, response) => {
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const query = {
    key: process.env.WEATHER_API_KEY,
    lat: request.query.lat,
    lon: request.query.lon
  };

  superagent
    .get(url)
    .query(query)
    .then(forecast => {
      const forecastArray = forecast.body.data.map(day => new Forecast(day));
      response.status(200).send(forecastArray);
    })
    .catch(err => {
      response.status(500).send(err.message);
    });
});

app.get('/movies', (request, response) => {
  console.log('movies');
  const url = 'https://api.themoviedb.org/3/search/movie';
  const query = {
    api_key: process.env.MOVIE_API_KEY,
    query: request.query.location,
  };
  superagent
    .get(url)
    .query(query)
    .then(movies => {
      const movieArray = movies.body.results.map(movie => new Movie(movie));
      response.status(200).send(movieArray);
      console.log(movieArray);
    })
    .catch(err => {
      response.status(500).send(err.message);
    });
});

app.use('*', (request, response) => {
  response.status(500).send('Server Error');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
