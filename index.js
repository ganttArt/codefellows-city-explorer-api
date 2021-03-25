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
    });
});

app.use('*', (request, response) => {
  response.status(500).send('Server Error');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
