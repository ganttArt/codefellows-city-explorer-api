'use strict';

let cache = require('./cache.js');

module.exports = getWeather;

function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const queryParams = {
    key: WEATHER_API_KEY,
    lang: 'en',
    lat: lat,
    lon: lon,
    days: 5,
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url)
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

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}



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
