// import { getAllEpisodes } from '../lib/api';
// import { useEffect, useState } from 'react';

// const Artists = () => {
//   const [episodes, setEpisodes] = useState(null);
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     getAllEpisodes(page)
//       .then((res) => {console.log(res.data); setEpisodes(res.data.results)})
//       .catch((err) => console.error(err));
//   }, [page]);
//   if (episodes === null) {
//     return <p>Loading...</p>;
//   }
// };
// export default Artists;
