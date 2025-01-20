import { useState, useEffect } from 'react';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft
} from 'react-icons/md';


// TrackSlider Component to show the tracklist with pagination
const TrackSlider = ({ albumTracks }) => {
  const tracksPerPage = 7;  // Number of tracks to show per page
  const [currentPage, setCurrentPage] = useState(0);  // Current page in the pagination
  const [currentTracks, setCurrentTracks] = useState([]);

  // Get the total number of tracks
  const totalTracks = albumTracks?.length || 0;

  // Update the currentTracks when the currentPage changes
  useEffect(() => {
    const tracksForCurrentPage = albumTracks?.slice(
      currentPage * tracksPerPage,
      (currentPage + 1) * tracksPerPage
    );
    setCurrentTracks(tracksForCurrentPage);
  }, [currentPage, albumTracks]);

  // Handle next page button click
  const nextPage = () => {
    if ((currentPage + 1) * tracksPerPage < totalTracks) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page button click
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
            <p>
              {track.position}. {track.title}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className='slider-controls'>
        <div
          className='arrows'
          onClick={prevPage}
          disabled={currentPage === 0}>
          <MdKeyboardDoubleArrowLeft />
        </div>
        <div
          className='arrows'
          onClick={nextPage}
          disabled={(currentPage + 1) * tracksPerPage >= totalTracks}>
          <MdKeyboardDoubleArrowRight />
        </div>
      </div>
    </div>
  );
};

export default TrackSlider;
