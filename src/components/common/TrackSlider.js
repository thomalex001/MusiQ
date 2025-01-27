import { useState, useEffect } from 'react';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft
} from 'react-icons/md';


const TrackSlider = ({ albumTracks }) => {
  const tracksPerPage = 8;  
  const [currentPage, setCurrentPage] = useState(0); 
  const [currentTracks, setCurrentTracks] = useState([]);

  const totalTracks = albumTracks?.length || 0;

  useEffect(() => {
    const tracksForCurrentPage = albumTracks?.slice(
      currentPage * tracksPerPage,
      (currentPage + 1) * tracksPerPage
    );
    setCurrentTracks(tracksForCurrentPage);
  }, [currentPage, albumTracks]);

  const nextPage = () => {
    if ((currentPage + 1) * tracksPerPage < totalTracks) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  } 

  return (
    <div className='trackslider-container'>
      <div className='track-name-and-number'>
        {currentTracks?.map((track, index) => (
          <div
            key={index}
            className='track-item'>
              {track.position !== "" && (
            <p>
              {track.position}{'. '}{track.title}{'  '}{track.duration}
            </p>

              )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className='slider-controls'>
        <div
            className={
              currentPage === 0
              ? 'arrow-active'
              : 'arrow-inactive'
            }
          onClick={prevPage}
          disabled={currentPage === 0}>
          <MdKeyboardDoubleArrowLeft />
        </div>
        <div
             className={
              (currentPage + 1) * tracksPerPage >= totalTracks
              ? 'arrow-active'
              : 'arrow-inactive'
            }
          onClick={nextPage}
          disabled={(currentPage + 1) * tracksPerPage >= totalTracks}>
          <MdKeyboardDoubleArrowRight />
        </div>
      </div>
    </div>
  );
};

export default TrackSlider;
