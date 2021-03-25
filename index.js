'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const WEATHER = require('./data/weather.json');

function Forecast(dailyForecast){
  this.date = dailyForecast.datetime;
  this.description = dailyForecast.weather.description;
}

app.get('/weather', (request, response) => {
  const forecastArray = WEATHER.data.map(day => new Forecast(day));
  console.log(forecastArray);
  console.log(request.query);
  response.status(200).send(forecastArray);
});

app.use('*', (request, response) => {
  response.status(500).send('Server Error');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
