'use strict';

require('dotenv');
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const app = express();

app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!')
  });
}  

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));






// 'use strict';

// const express = require('express');
// require('dotenv').config();
// const cors = require('cors');
// const app = express();
// app.use(cors());
// const PORT = process.env.PORT;

// const getWeather = require('./modules/weather');
// const getMovies = require('./modules/movies');

// app.get('/weather', getWeather);
// app.get('/movies', getMovies);

// app.use('*', (request, response) => {
//   response.status(500).send('Server Error');
// });

// app.listen(PORT, () => console.log(`listening on ${PORT}`));
