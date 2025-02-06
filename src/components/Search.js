import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected index

  const navigate = useNavigate();
  const goToArtist = (artistId) => navigate(`/artist/${artistId}`);

  

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
    }, 1000),
    [] 
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setIsLoading(true)
    setQuery(value);
  };

  useEffect(() => {
    setSelectedIndex(null)
    if (query.length >= 2) {
      handleSearch(query);
    } else {
      setIsLoading(false)
      setSearchedResults([]); // Clear results if query length is less than 2
    }
  }, [query, handleSearch]); // Depend on query and handleSearch

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (searchedResults.length === 0) return;
  
      if (e.key === 'ArrowDown') {
        setSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === searchedResults.length - 1
            ? 0
            : prevIndex + 1
        );
      }
  
      if (e.key === 'ArrowUp') {
        setSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === 0
            ? searchedResults.length - 1
            : prevIndex - 1
        );
      }
  
      if (e.key === 'Enter' && selectedIndex !== null) {
        const selectedResult = searchedResults[selectedIndex];
        goToArtist(selectedResult.title);
      }
  
      if (e.key === 'Escape') {
        setSelectedIndex(null); 
      }
    };
    document.addEventListener('keydown', handleKeyDown);

 
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchedResults, selectedIndex]); 

  return (
    <>
      <Navbar />
      <main className='main'>
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
                <div className='search-results-container' tabIndex={0}>
                  {searchedResults.length === 0 && (
                    <div className='no-result-or-loading-message-box'>
                      <p>Sorry, no results found for "{query}"</p>
                    </div>
                  )}
                  {searchedResults.map((result, index) => (
                    <button
                    className={`search-results-button ${
                      index === selectedIndex ? 'search-results-button is-selected' : ''
                    }`} 
                      key={result.id}
                      onClick={() => goToArtist(result.title)}>
                      {result.type === 'artist' && (
                        <>
                          <img
                            src={result.cover_image}
                            alt={result.title}
                          />
                          {/* <div className='result-text-div'> */}
                            <p id='result-text-p'>{result.title}</p>
                          {/* </div> */}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
