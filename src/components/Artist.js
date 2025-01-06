import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams } from 'react-router-dom';

const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();

  useEffect(() => {
    if (artist.id) {
      API.GET(API.ENDPOINTS.getArtistAlbums(artist.id))
        .then(({ data }) => {
          console.log('artist data ONE', data);
          setArtistAlbumsData(data);
        })
        .catch((e) => console.error(e));
    }
  }, [artist.id]);
  
  const releases = artistAlbumsData
  

console.log('artistAlbumData', artistAlbumsData)



  return (
<>
  <div>
    <h1>{artist.id} Great choice!!!</h1>
  </div>
  <div>
    {releases == null ? (
      <p>Loading artist data...</p>  // Show loading if releases is null
    ) : releases.results && releases.results.length > 0 ? (
      <div>
        {releases.results.map((release) => (
          release.master_id ? (
            <div key={release.id}>
              <p>ARTIST: {release.title}</p>  
              <p>YEAR: {release.year}</p>
              <img 
                src={release.cover_image} 
                alt={release.title} 
                style={{ width: '150px', height: '150px' }} 
              />
            </div>
          ) : (
            <p>No album found...</p>  // Handle case if release is falsy
          )
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
