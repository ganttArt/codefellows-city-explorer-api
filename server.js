'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT;

const weatherHandler = require('./modules/weather');
const movieHandler = require('./modules/movies');

app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);

app.use('*', (request, response) => {
  response.status(500).send('Server Error');
});

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
