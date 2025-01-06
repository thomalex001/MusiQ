import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams } from 'react-router-dom';

const Artist = () => {
  const [artistData, setArtistData] = useState([]);
  const artist = useParams();

  useEffect(() => {
    if (artist.id) {
      API.GET(API.ENDPOINTS.getArtist(artist.id))
        .then(({ data }) => {
          console.log('artist data ONE', data);
          setArtistData(data);
        })
        .catch((e) => console.error(e));
    }
  }, [artist.id]);
  
  const releases = artistData?.releases;

  return (
    <>
      <div>
        <h1>Great choice!!!</h1>
      </div>
      <div>
        {artistData === null ? (
          <p>Loading artist data...</p>  // Show loading if artistData is null
        ) : releases && releases.length > 0 ? (
          <div>
            {releases.map((release) => (
              release.format === 'Album' ? (
                <>
                <p key={release.id}>ARTIST {release.artist}</p>  
                <p key={release.id.title}>TITLE {release.title}</p>  
                <p key={release.id.year}>YEAR {release.year}</p>  
                </>
              ) : <p>no album </p>
            ))}
          </div>
        ) : (
          <p>No releases available.</p>  // Show if releases array is empty
        )}
      </div>
    </>
  );
};

export default Artist;
