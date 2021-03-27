'use strict';

const superagent = require('superagent');
let cache = require('./cache.js');

class Weather {
  constructor(day) {
    this.date = day.weather.description;
    this.description = day.datetime;
  }
}

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  getWeather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong with your weather request.');
    });
}

function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const queryParams = {
    key: process.env.WEATHER_API_KEY,
    lang: 'en',
    lat: latitude,
    lon: longitude,
    days: 5,
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent
      .get(url)
      .query(queryParams)
      .then(response => parseWeather(response.body));
  }
  console.log(cache);
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = weatherHandler;
