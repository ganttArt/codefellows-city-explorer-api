'use strict';
const superagent = require('superagent');

function Movie(movie) {
  this.title = movie.title;
  this.description = movie.overview;
}

function getMovies(request, response) {
  console.log('movies');
  const url = 'https://api.themoviedb.org/3/search/movie';
  const query = {
    api_key: process.env.MOVIE_API_KEY,
    query: request.query.location,
  };
  superagent
    .get(url)
    .query(query)
    .then(movies => {
      const movieArray = movies.body.results.map(movie => new Movie(movie));
      response.status(200).send(movieArray);
      console.log(movieArray);
    })
    .catch(err => {
      response.status(500).send(err.message);
    });
}

module.exports = getMovies;
