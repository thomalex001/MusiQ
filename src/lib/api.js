import axios from 'axios';
// import { AUTH } from './auth';

const KEY = 'TruYuzKvtmWQwkzwFutY'
const SECRET = 'gznOuTcUwZJtommNzEORZRUJyjaJqlOD'
const ENDPOINTS = {
  // allBeers: '/api/crafty-beers',
  // singleBeer: (id) => `/api/crafty-beers/${id}`,
  // allBreweries: '/api/breweries',
  // createReview: (id) => `/api/crafty-beers/${id}/reviews`,
  // login: '/api/login',
  // singleReview: (beerId, reviewId) =>
  //   `/api/crafty-beers/${beerId}/reviews/${reviewId}`,
  // register: '/api/register',
  search: (query) => `https://api.discogs.com/database/search?q=${query}&key=${KEY}&secret=${SECRET}`,

};

// const getHeaders = () => ({
//   headers: { authorization: `Bearer ${AUTH.getToken()}` }
// });

const GET = (endpoint) => axios.get(endpoint);
// const POST = (endpoint, body, headers) =>
//   headers
//     ? axios.post(endpoint, body, headers)
//     : axios.post(endpoint, body);
// const PUT = (endpoint, body, headers) => axios.put(endpoint, body, headers);
// const DELETE = (endpoint, headers) => axios.delete(endpoint, headers);

export const API = { GET, ENDPOINTS };
