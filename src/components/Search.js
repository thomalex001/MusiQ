import { useState, useEffect, useCallback } from 'react';
import { API } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import Navbar from './common/Navbar';
import RandomWallpaper from './common/RandomWallpaper';
import Footer from './Footer';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.length < 2) {
        setSearchedResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      API.GET(API.ENDPOINTS.search(searchQuery))
        .then(({ data }) => {
          console.log(data)

    const filteredResults = data.results
      .filter((result) => result.type === 'artist' && 
      !result.title.includes('('))
      .slice(0, 5);


    setSearchedResults(filteredResults);
  })
        .catch((e) => {
          console.error('Error fetching search results:', e);
          setSearchedResults([]); 
        })
        .finally(() => setIsLoading(false));
    }, 500),
    [] 
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setIsLoading(true)
    setQuery(value);
  };

  useEffect(() => {
    if (query.length >= 2) {
      handleSearch(query);
    } else {
      setIsLoading(false)
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
              {isLoading && (
                <div className='no-result-or-loading-message-box'>
                  <p>Loading...</p>
                </div>
              )}

              {query && !isLoading && (
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
                            <p id='result-text-p'>{result.title}</p>
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
