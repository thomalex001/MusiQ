import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import {debounce} from 'lodash';
import Navbar from './common/Navbar';
import RandomWallpaper from './common/RandomWallpaper';
import Footer from './Footer'

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce((searchQuery) => {
    if (searchQuery.length < 2) {
      setSearchedResults([]); 
      setLoading(false); 
      return; 
    }

    setLoading(true); 

  
    if (searchQuery.length >= 2) {
      API.GET(API.ENDPOINTS.search(searchQuery))
        .then(({ data }) => {

          setSearchedResults(data.results.slice(0, 5)); 
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false)); 
    }
  }, 500); 

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); 
  };

 
  useEffect(() => {
    setDebouncedQuery(query);
  }, [query]);


  useEffect(() => {
    if (debouncedQuery !== '') {
      handleSearch(debouncedQuery); 
    }
  }, [debouncedQuery]); 

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

              {debouncedQuery && !loading && (
                <div className='search-results-container'>
                  {searchedResults.length === 0 && (
                    <div className='no-result-or-loading-message-box'>
                      <p>Sorry, no results found for "{debouncedQuery}"</p>
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
};