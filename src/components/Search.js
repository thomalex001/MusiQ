import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import {debounce} from 'lodash';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce((searchQuery) => {
    if (searchQuery.length < 2) {
      setSearchedResults([]);  // Clear results if search query is too short
      setLoading(false);  // Stop loading
      return;  // Don't make the API call if query is less than 2 characters
    }

    setLoading(true);  // Set loading state when starting the search

    // Make the API request only if the query length is >= 2
    if (searchQuery.length >= 2) {
      API.GET(API.ENDPOINTS.search(searchQuery))
        .then(({ data }) => {
          // console.log('DATA', data);
          setSearchedResults(data.results.slice(0, 5));  // Store the results from the API
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));  // Stop loading when the request is finished
    }
  }, 300);  // 500ms debounce delay

  // Handles the input change event
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);  // Update the query
  };

  // Trigger debounced search whenever query changes
  useEffect(() => {
    setDebouncedQuery(query);  // Update the debounced query
  }, [query]);

  // Perform search when the debounced query changes
  useEffect(() => {
    handleSearch(debouncedQuery);  // Trigger debounced search function
  }, [debouncedQuery]);  // Only trigger when debounced query changes

  // Navigate to artist's page
  const goToArtist = (artistId) => navigate(`/artist/${artistId}`);


  return (
    <div>
      <input
        type="text"
        placeholder="Search an artist or band"
        value={query}
        onChange={handleChange}
      />
      {loading && <p>Loading...</p>} {/* Show loading message while fetching data */}
      
      {/* Show results only after typing finishes (i.e., after debounce delay) */}
      {debouncedQuery && !loading && (
        <div>
          {searchedResults.length === 0 && (
            <p>No results found for "{debouncedQuery}"</p>
          )}
          {searchedResults.map((result) => (
            <div key={result.id}>
              {result.type === 'artist' && (
                <>
                  <p>{result.title}</p>
                  <img
                    onClick={() => goToArtist(result.title)}
                    src={result.cover_image}
                    alt={result.title}
                    style={{ cursor: 'pointer', width: '150px', height: '150px' }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};