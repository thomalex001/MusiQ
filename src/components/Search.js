import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const handleChange = (e) => setQuery(e.target.value);

  useEffect(() => {
    if (query) {
      API.GET(API.ENDPOINTS.search(query))
        .then(({ data }) => {
          console.log('data', data);
          setSearchedResults(data.results);
        })
        .catch((e) => console.error(e));
    }
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
      />
      <div>
        {searchedResults.map((result) => (
          <>
            <div>
              
              {result.type === 'artist' ? (
                <Link to={`artist/${result.id}`}>
                  <p>{result.title}</p>
                  <img
                    src={result.cover_image}
                    alt={result.title}></img>
                </Link> // This is what will be shown when result.type is not 'Artist'
              ) : (
                <p></p> // This is what will be shown when result.type is 'Artist'
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
