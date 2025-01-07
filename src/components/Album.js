import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams } from 'react-router-dom';

const Album = () => {
  const [albumData, setAlbumData] = useState([]);
  const album = useParams();

  useEffect(() => {
    if (album.id) {
      API.GET(API.ENDPOINTS.getAlbum(album.id))
        .then(({ data }) => {
          console.log('ALBUM DATA', data);
          setAlbumData(data);  // Update state with API response
        })
        .catch((e) => console.error(e));
    }
  }, [album.id]);


 
  console.log('ALBUM DETAILS', albumData);

  return (
    <>
      <div>
        <h1>Album Details</h1>
      </div>
      <div>
        {albumData == null ? (
          <p>Loading album data...</p>  // Show loading if albumDetails is null
        ) : (
          <div>
            <p>{albumData.artists_sort}</p>
            <img
              src={albumData.cover_image}
              alt={albumData.title}
              style={{ width: '150px', height: '150px' }}
            />
          </div>
        )}
          <p>No album details available.</p> 
      </div>
    </>
  );
};

export default Album;
