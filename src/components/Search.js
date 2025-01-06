import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import Artist from './Artist';
import { useParams, useNavigate } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const handleChange = (e) => setQuery(e.target.value);
  const navigate = useNavigate()


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

  const goToArtist = (artistId) => navigate(`/artist/${artistId}`)

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
                <>
                  <p>{result.title}</p>
                  <img
                    onClick={() => goToArtist(result.id)}
                    src={result.cover_image}
                    alt={result.title}></img>
                </>
              ) : (
                <p></p>
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
