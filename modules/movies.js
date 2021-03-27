'use strict';

const superagent = require('superagent');
let cache = require('./cache.js');

function Movie(movie) {
  this.title = movie.title;
  this.description = movie.overview;
}

function movieHandler(request, response){
  getMovies(request.query.location)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong with your movie request.');
    });
}

function getMovies(location) {
  const key = 'movies-' + location;
  const url = 'https://api.themoviedb.org/3/search/movie';
  const queryParams = {
    api_key: process.env.MOVIE_API_KEY,
    query: location,
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
      .then(response => parseMovies(response.body.results));
  }
  console.log(cache);
  return cache[key].data;
}

function parseMovies(movieData) {
  try {
    const movieSummaries = movieData.map(movie => {
      return new Movie(movie);
    });
    return Promise.resolve(movieSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = movieHandler;
