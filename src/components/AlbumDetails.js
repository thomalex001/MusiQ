// import { useState, useEffect } from 'react';
// import { API } from '../lib/api';
// import { useParams } from 'react-router-dom';
// import Artist from './Artist';

// //********IMPORT ARTIST_ALBUMS_DATA AS PARAMETER FROM "ARTIST" FUNCTION********//
// const AlbumDetails = (artistAlbumsData) => {
//   const [albumData, setAlbumData] = useState([]);
//   const album = useParams();
// //********FETCH DETAILS FOR SELECTED ALBUM BY USER ****************************//
//   useEffect(() => {
//     if (album.id) {
//       API.GET(API.ENDPOINTS.getAlbum(album.id))
//         .then(({ data }) => {
//           console.log('ALBUM DATA', data);
//           setAlbumData(data);
//           getSelectedAlbumData()  // Update state with API response
//         })
//         .catch((e) => console.error(e));
//     }

//   }, [album.id]);

//   console.log('ARTIST ALBUMS DATA', artistAlbumsData);
// const getSelectedAlbumData = () => {
//   artistAlbumsData.filter((artistAlbum) => {
//     return console.log(artistAlbum.album.id)
//   })
// }

//   return (
//     <>
//       <div>
//         <h1>Album details for:  </h1>
//       </div>
//       <div>
//         {albumData == null ? (
//           <p>Loading album data...</p> 
//         ) : (
//           <div>
//             <h2>{albumData.artists_sort}</h2>
//             <img
//               src={albumData.cover_image}
//               alt={albumData.title}
//               style={{ width: '150px', height: '150px' }}
//             />
//           </div>
//         )}

//       </div>
//     </>
//   );
// };

// export default AlbumDetails;
