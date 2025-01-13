// useEffect(() => {
//   if (artist.id) {
//     API.GET(API.ENDPOINTS.getArtistAlbums(artist.id, country))
//       .then(({ data }) => {
//         // console.log('DATA', data);
        

//         //********GET ONLY ALBUMS WITH ONE MASTER ID********//
//         const seenMasterIds = new Set();
//         const uniqueAlbums = [];
//         data.results.forEach((album) => {
//           if (album.master_id && !seenMasterIds.has(album.master_id)) {
//             seenMasterIds.add(album.master_id);
//             uniqueAlbums.push(album);
//           }
//         });
//         // console.log('UNIQUE ALBUMS', uniqueAlbums);

//         //********FROM UNIQUE ALBUMS, FILTER OUT THE ONES WITH SPACER.GIF AS AN IMAGE*******//
//         //* => AS IT SHOWS A SINGLE PIXEL IMAGE********//
//         const filteredResults = uniqueAlbums.filter(
//           (album) => album.cover_image.slice(-10) !== 'spacer.gif'
//         );
//         if (filteredResults.length < 6 ) {
//           console.log("LENGTH",filteredResults.length, "COUNTRY", country)
//           fetchCountries()
//         } 
        
//         setArtistAlbumsData(filteredResults); // Update state with API response
//         console.log('FILTERED RESULTS', filteredResults, country);
//       })
//       .catch((e) => console.error(e));
//   }
// }, [artist.id, country]);



const randomQuestionIndex = Math.floor(Math.random() * 3);
console.log(randomQuestionIndex)