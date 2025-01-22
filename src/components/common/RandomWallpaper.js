import ArtistsImage1 from '../../media/best-artists-60s.png';
import ArtistsImage2 from '../../media/best-artists-70s.png';
import ArtistsImage3 from '../../media/best-artists-80s.png';
import ArtistsImage4 from '../../media/best-artists-90s.png';
import ArtistsImage5 from '../../media/best-artists-2000s.png';
import ArtistsImage6 from '../../media/best-artists-2020s.png';

import React from 'react';

const RandomWallpaper = React.memo(() => {
  const randomImages = [
    ArtistsImage1,
    ArtistsImage2,
    ArtistsImage3,
    ArtistsImage4,
    ArtistsImage5,
    ArtistsImage6
  ];
  const randomIndex = Math.floor(Math.random() * randomImages.length);
  const selectedImage = randomImages[randomIndex]
  return (
    <>
    <img id='wallpaper' src={selectedImage}
    alt={selectedImage}/>
    </>
  )
}
)
export default RandomWallpaper