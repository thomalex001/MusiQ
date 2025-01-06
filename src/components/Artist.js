import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';


const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    if (artist.id) {
      API.GET(API.ENDPOINTS.getArtistAlbums(artist.id))
        .then(({ data }) => {
          console.log('artist data ONE', data);
          setArtistAlbumsData(data); // Update state with API response
        })
        .catch((e) => console.error(e));
    }
  }, [artist.id]);
  const gotoAlbum = (albumId) => navigate(`/artist/album/${albumId}`)

  const releases = artistAlbumsData.results;
  console.log('artistAlbumsData', artistAlbumsData);

  return (
    <>
      <div>
        <h1>{artist.id} Great choice!!!</h1>
      </div>
      <div>
        {releases == null || !releases ? (
          <p>Loading artist data...</p> // Show loading if releases is null or doesn't have results
        ) : releases.length > 0 ? (
          <div>
            {releases.map((release) =>
              release.master_id ? (
                <div key={release.id}>
                  <img
                    onClick={() => gotoAlbum(release.id)}
                    src={release.cover_image}
                    alt={release.title}
                    style={{ cursor: 'pointer', width: '150px', height: '150px' }}
                  />
                  
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p>No releases available.</p> // Show if releases array is empty
        )}
      </div>
    </>
  );
};

export default Artist;
