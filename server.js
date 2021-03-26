'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT;

const weatherHandler = require('./modules/weather');

app.get('/weather', weatherHandler);

app.listen(PORT, () => console.log(`Server up on ${PORT}`));




// 'use strict';

// const express = require('express');
// require('dotenv').config();
// const cors = require('cors');
// const app = express();
// app.use(cors());
// const PORT = process.env.PORT;

// const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');

// app.get('/weather', getWeather);
app.get('/movies', getMovies);

// app.use('*', (request, response) => {
//   response.status(500).send('Server Error');
// });

// app.listen(PORT, () => console.log(`listening on ${PORT}`));
