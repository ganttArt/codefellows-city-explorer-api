'use strict';
const superagent = require('superagent');

function Forecast(dailyForecast) {
  this.date = dailyForecast.datetime;
  this.description = dailyForecast.weather.description;
}

function getWeather(request, response) {
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
}

module.exports = getWeather;
