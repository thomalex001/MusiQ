import { useState, useEffect, useCallback } from 'react';
import { API } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import Navbar from './common/Navbar';
import RandomWallpaper from './common/RandomWallpaper';
import Footer from './Footer';

export default function Search() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Using lodash's debounce function
  const handleSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.length < 2) {
        setSearchedResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      API.GET(API.ENDPOINTS.search(searchQuery))
        .then(({ data }) => {
          setSearchedResults(data.results.slice(0, 5)); // Limit results to 5
        })
        .catch((e) => {
          console.error('Error fetching search results:', e);
          setSearchedResults([]); // Clear search results on error
        })
        .finally(() => setLoading(false));
    }, 500),
    [] // Dependency array is empty so debounce function is stable
  );

  // Handle user input and update query
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  // Use effect to trigger search once query changes (debounced)
  useEffect(() => {
    setDebouncedQuery(query)
    if (query.length >= 2) {
      handleSearch(query);
    } else {
      setSearchedResults([]); // Clear results if query length is less than 2
    }
  }, [query, handleSearch]); // Depend on query and handleSearch

  const goToArtist = (artistId) => navigate(`/artist/${artistId}`);

  return (
    <>
      <Navbar />
      <div className='main'>
        <div className='search-page'>
          <h1>MusiQ-All</h1>
          <h2>
            Data provided by{' '}
            <a
              href='https://www.discogs.com/developers/'
              target='_blank'
              rel='noreferrer'>
              Discogs
            </a>{' '}
            for developers
          </h2>

          <div className='search-main-container'>
            <RandomWallpaper />
            <div className='search-container'>
              <input
                id='search-input'
                type='text'
                placeholder='Search an artist or band'
                value={query}
                onChange={handleChange}
              />
              {loading && (
                <div className='no-result-or-loading-message-box'>
                  <p>Loading...</p>
                </div>
              )}

              {query && !loading && (
                <div className='search-results-container'>
                  {searchedResults.length === 0 && (
                    <div className='no-result-or-loading-message-box'>
                      <p>Sorry, no results found for "{query}"</p>
                    </div>
                  )}
                  {searchedResults.map((result) => (
                    <div
                      className='search-results-box'
                      key={result.id}
                      onClick={() => goToArtist(result.title)}>
                      {result.type === 'artist' && (
                        <>
                          <img
                            src={result.cover_image}
                            alt={result.title}
                          />
                          <div className='result-text-div'>
                            <p id='result-text'>{result.title}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
