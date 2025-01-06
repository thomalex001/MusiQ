import axios from 'axios';
// import { AUTH } from './auth';

const KEY = process.env.REACT_APP_API_KEY;
const SECRET = process.env.REACT_APP_API_SECRET;

const ENDPOINTS = {
  search: (query) => `https://api.discogs.com/database/search?q=${query}&key=${KEY}&secret=${SECRET}`,

};



const GET = (endpoint) => axios.get(endpoint);
// const POST = (endpoint, body, headers) =>
//   headers
//     ? axios.post(endpoint, body, headers)
//     : axios.post(endpoint, body);
// const PUT = (endpoint, body, headers) => axios.put(endpoint, body, headers);
// const DELETE = (endpoint, headers) => axios.delete(endpoint, headers);

export const API = { GET, ENDPOINTS };
