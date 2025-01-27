import axios from 'axios';

const KEY = process.env.REACT_APP_API_KEY;
const SECRET = process.env.REACT_APP_API_SECRET;

const ENDPOINTS = {
  search: (query) =>
    `https://api.discogs.com/database/search?q=${query}&key=${KEY}&secret=${SECRET}`,
  getArtistAlbums: (query, country) =>
    `https://api.discogs.com/database/search?q=${query}&country=${country}&artist=${query}&type=release&format=album&artist=${query}&type=release&format=album&key=${KEY}&secret=${SECRET}`,
  getAlbum: (selectedAlbumId) =>
    `https://api.discogs.com/releases/${selectedAlbumId}`
};

const GET = (endpoint) => axios.get(endpoint);


export const API = { GET, ENDPOINTS };
