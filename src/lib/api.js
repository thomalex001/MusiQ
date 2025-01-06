import axios from 'axios';
// import { AUTH } from './auth';

const KEY = process.env.REACT_APP_API_KEY;
const SECRET = process.env.REACT_APP_API_SECRET;

const ENDPOINTS = {
  search: (query) => `https://api.discogs.com/database/search?q=${query}&key=${KEY}&secret=${SECRET}`,
  getArtistAlbums: (query) => `https://api.discogs.com/database/search?q=${query}&country=uk&artist=${query}&type=release&format=album&key=${KEY}&secret=${SECRET}`
};

const GET = (endpoint) => axios.get(endpoint);

export const API = { GET, ENDPOINTS };
