'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const weather = require('./data/weather.json');


app.get('/weather', (request, response) => {
  response.send(weather);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
