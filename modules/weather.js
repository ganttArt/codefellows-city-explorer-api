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
      response.status(500).send('Sorry. Something went wrong!');
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


// 'use strict';
// const superagent = require('superagent');

// function Forecast(dailyForecast) {
//   this.date = dailyForecast.datetime;
//   this.description = dailyForecast.weather.description;
// }

// function getWeather(request, response) {
//   const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
//   const query = {
//     key: process.env.WEATHER_API_KEY,
//     lat: request.query.lat,
//     lon: request.query.lon
//   };

//   superagent
//     .get(url)
//     .query(query)
//     .then(forecast => {
//       const forecastArray = forecast.body.data.map(day => new Forecast(day));
//       response.status(200).send(forecastArray);
//     })
//     .catch(err => {
//       response.status(500).send(err.message);
//     });
// }

// module.exports = getWeather;
