import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const handleChange = (e) => setQuery(e.target.value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!query) {
      setIsDropdownOpen(false);
    }
    if (query) {
      API.GET(API.ENDPOINTS.search(query))
        .then(({ data }) => {
          console.log('data', data);
          setSearchedResults(data.results);
          setIsDropdownOpen(true);
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
      <div>{query}</div>
      {isDropdownOpen && (
        <div>
          {searchedResults.map((result) => (
            <p key={result.id}>{result.id}</p>
          ))}
        </div>
      )}
    </div>
  );
}
