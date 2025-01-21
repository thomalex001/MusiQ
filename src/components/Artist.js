import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import AlbumsList from './AlbumsList';
import TrackSlider from './common/TrackSlider';
import { TfiClose } from 'react-icons/tfi';
import Navbar from './common/Navbar';

const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [yearAnswersArray, setYearAnswersArray] = useState([]);
  const [albumAnswersArray, setAlbumAnswersArray] = useState([]);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState({});
  const [nextButtonIsClicked, setNextButtonIsClicked] = useState(false);
  const [country, setCountry] = useState('');
  const [albumTrackAnswersArray, setAlbumTrackAnswersArray] = useState([]);
  const [selectedAlbumsArray, setSelectedAlbumsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null); // Error state
  const [randomTrack, setRandomTrack] = useState(null);
  const [score, setScore] = useState(0);
  const [quizIsFinished, setQuizIsFinished] = useState(false);
  const [albumIsClicked, setAlbumIsClicked] = useState(false);
  const [clickedAlbum, setClickedAlbum] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(null);

  // const [currentTracks, setCurrentTracks] = useState(null);
  // const [prevPage, setPrevPage] = useState(null);
  // const [nextPage, setNextPage] = useState(null);
  // const [currentPage, setCurrentPage] = useState(0);
  // const [tracksPerPage, setTracksPerPage] = useState(0);
  // const [totalTracks, setTotalTracks] = useState(0);

  //********GET CURRENT YEAR TO AVOID SHOWING A YEAR IN THE FUTURE IN HANDLE_ANSWER_CLICK********//
  const today = new Date();
  const currentYearStr = `${today.getFullYear()}`;
  const currentYearInt = parseInt(currentYearStr);

  //********SCORING FUNCTIONS********//
  //********COUNT FROM 1 TO 5 QUESTIONS ANSWERED ********//
  const [count, setCount] = useState(1);
  const countToFive = () => {
    if (count < 5) {
      setCount(count + 1);
    } else {
      setQuizStarted(false);
      setQuizIsFinished(true);
    }
  };
  //********ADD POINTS********//
  const addPoint = () => {
    setScore(score + 1);
  };

  //********CHECK IF IMAGE FROM ALBUMS IS A VALID IMAGE********//
  // const isImageValid = async (url) => {
  //   try {
  //     const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
  //     return (
  //       response.ok && response.headers.get('Content-Type').includes('image')
  //     );
  //   } catch (e) {
  //     return false;
  //   }
  // };

  //********FETCH ONLY ALBUMS WITH A UNIQUE MASTER ID********//
  const fetchAlbumsWithUniqueMasterId = async (artistId, country) => {
    return API.GET(API.ENDPOINTS.getArtistAlbums(artistId, country))
      .then(({ data }) => {
        const seenMasterIds = new Set();
        const uniqueAlbums = [];
        data.results.forEach((album) => {
          if (album.master_id && !seenMasterIds.has(album.master_id)) {
            seenMasterIds.add(album.master_id);
            uniqueAlbums.push(album);
            // console.log("DATA", data)
          }
        });
        // console.log("UNIQUE ALBUMS", uniqueAlbums)
        //********FILTER OUT ALBUMS WITH SPACER.GIF AS A COVER_IMAGE AS IT SHOWS A SINGLE PIXEL********//
        return uniqueAlbums.filter(
          (album) => album.cover_image?.slice(-10) !== 'spacer.gif'
        );
      })
      .catch((e) => {
        console.error('Error fetching albums for country:', country, e);
        return [];
      });
  };

  //********FETCH ALBUMS WHEN ARTIST ID CHANGES********//
  useEffect(() => {
    //********FETCH ALBUMS FROM DIFFERENT COUNTRIES********//
    const fetchAlbumsForAllCountries = async (artistId) => {
      const countries = ['US', 'USA', 'France'];
      let albumsFromAllCountries = [];
      let countFromAllCountries = [];
      let albumsFromTopCountry = [];

      for (const newCountry of countries) {
        const countryAlbums = await fetchAlbumsWithUniqueMasterId(
          artistId,
          newCountry
        );
        countFromAllCountries.push({
          country: newCountry,
          count: countryAlbums.length
        });
        albumsFromAllCountries = [...albumsFromAllCountries, ...countryAlbums]; // Collect albums from all countries
      }
      //********FIND THE COUNTRY WITH THE MOST ALBUMS********//
      const topCountry = countFromAllCountries.reduce(
        (max, current) => {
          return current.count > max.count ? current : max;
        },
        { country, count: 0 }
      );
      //********FILTER TO RETURN ALBUMS FROM TOP COUNTRY ONLY********//
      // console.log("TOP COUNTRY IS", topCountry.country)
      // console.log("ALBUMS FROM ALL COUNTRIES", albumsFromAllCountries)
      albumsFromTopCountry = albumsFromAllCountries.filter(
        (album) => album.country === topCountry.country
      );
      setArtistAlbumsData(albumsFromTopCountry);
      setCountry(topCountry.country);
      setLoading(false);
      // console.log("ALBUMS FROM TOP COUNTRY", albumsFromTopCountry)
    };
    if (artist.id && !country) {
      fetchAlbumsForAllCountries(artist.id);
    }
  }, [artist.id, country]);

  if (loading) return <div>Loading...</div>;
  if (artistAlbumsData.length === 0)
    return <div>Sorry, no data for this artist...</div>;
  // const albums = artistAlbumsData;
  // console.log('ALBUMS', albums)//

  //********FUNCTION TO GET ONE RANDOM ALBUM FOR THE QUIZ********//
  const getRandomAlbum = () => {
    if (artistAlbumsData.length > 0) {
      const randomAlbumIndex = Math.floor(
        Math.random() * artistAlbumsData.length
      );
      const selectedAlbum = artistAlbumsData[randomAlbumIndex];

      if (!selectedAlbum.year) {
        getRandomAlbum();
        return;
      }

      console.log(
        'SELECTED ALBUM ',
        selectedAlbum.id,
        ' - ',
        selectedAlbum.title,
        ' - ',
        selectedAlbum.year
      );

      // if (selectedAlbum.year === undefined || selectedAlbum.year === 0 || isNaN(selectedAlbum.year)) {
      //   getRandomAlbum()
      //   console.log('UNDEFINED YEAR')
      // }

      //********STORE SELECTED ALBUMS IN AN ARRAY EACH TIME A QUESTION...********//
      //********...IS ANSWERED AND CHECK FOR DUPLICATES********//
      const isDuplicate = selectedAlbumsArray.some(
        (album) => album.title === selectedAlbum.title
      );
      if (isDuplicate) {
        console.log('Duplicate found. Trying again...');
        getRandomAlbum();
      } else {
        setSelectedAlbumsArray((prevSelectedAlbums) => [
          ...prevSelectedAlbums,
          selectedAlbum
        ]);
      }

      //********CALL EITHER QUESTION 1, 2 or 3.********//
      const randomQuestion = [nameTheAlbumQuestion, nameTheYearQuestion];
      const randomQuestionIndex = Math.floor(Math.random() * 2);
      randomQuestion[randomQuestionIndex](selectedAlbum);

      getSelectedAlbumDetails(selectedAlbum);
      setQuizStarted(true);
      setQuizIsFinished(false);
      setNextButtonIsClicked(true);
      setQuestionAnswered(false);
      setSelectedAlbum(selectedAlbum);
    }
  };

  //********QUESTION 3: FETCHING******************************************//
  //********WHICH OF THEESE TRACKS APPEAR ON THIS ALBUM?******************//
  //********FETCH SELECTED ALBUM DATA FROM GET_ALBUM API******************//
  const getSelectedAlbumDetails = async (selectedAlbum) => {
    // console.log('YOU ENTERED GETSELECTEDALBUMDETAILS');
    try {
      const { data } = await API.GET(API.ENDPOINTS.getAlbum(selectedAlbum.id));
      // console.log('SELECTED ALBUM DETAILS:', data);
      //********EXTRACT ONE TRACK FROM SELECTED ALBUM********//
      const tracklist = data.tracklist || [];
      //********STORE ALBUM_ID DETAILS IN SET_CLICKED_ALBUM WHEN ALBUM IS CLICKED BY USER*******//
      setClickedAlbum(data);

      if (tracklist.length > 0) {
        const randomIndex = Math.floor(Math.random() * tracklist.length);
        const randomTrack = tracklist[randomIndex].title;
        setRandomTrack(randomTrack);
      } else {
        console.log('No tracks available for this album.');
      }
    } catch (error) {
      console.error('Error fetching album details:', error);
    }
  };

  //********QUESTION 1 & 2 :******************************************//
  //********WHAT IS THE NAME OF THE ALBUM?********//
  //*******WHAT YEAR THIS ALBUM WAS FIRST RELEASED?********//
  //********FILTER OUT ANSWERS SO THAT REMAINING ALBUMS ARE NOT THE SAME AS SELECTED ALBUM********//
  const nameTheAlbumQuestion = (selectedAlbum) => {
    // console.log('-- NAMETHEALBUMQUESTION');
    const remainingAlbums = artistAlbumsData.filter(
      (album) => album.title.slice(-3) !== selectedAlbum.title.slice(-3)
    );

    //********RANDOMLY SELECT TWO INCORRECT ANSWERS*********************//
    const randomIncorrectAnswers = [];
    while (randomIncorrectAnswers.length < 2) {
      const index = Math.floor(Math.random() * remainingAlbums.length);
      if (!randomIncorrectAnswers.includes(index)) {
        randomIncorrectAnswers.push(index);
      }
    }
    //********ENSURE THE 2 INCORRECT ANSWERS DO NOT HAVE THE SAME TITLE****//
    const incorrectAnswers = randomIncorrectAnswers.map(
      (index) => remainingAlbums[index]
    );
    if (
      incorrectAnswers[0].title.length >= 3 &&
      incorrectAnswers[1].title.length >= 3 &&
      incorrectAnswers[0].title.slice(-3) ===
        incorrectAnswers[1].title.slice(-3)
    ) {
      getRandomAlbum();
      return;
    }
    const albumAnswersArray = [selectedAlbum, ...incorrectAnswers];
    const albumTrackAnswersArray = [selectedAlbum, ...incorrectAnswers];
    const shuffledAlbumTrackAnswers = shuffleAnswers(albumTrackAnswersArray);
    const shuffledAlbumAnswers = shuffleAnswers(albumAnswersArray);

    //********RANDOMLY PICK BETWEEN (Q1)ALBUM_ANSWERS OR (Q2)ALBUM_TRACK_ANSWERS********//
    for (let i = 0; i < 1; i++) {
      const randomChoice = Math.floor(Math.random() * 2);
      if (randomChoice === 0) {
        setAlbumAnswersArray([]);
        setAlbumTrackAnswersArray(shuffledAlbumTrackAnswers);
      } else {
        setAlbumTrackAnswersArray([]);
        setAlbumAnswersArray(shuffledAlbumAnswers);
      }
    }
    setYearAnswersArray([]);
  };

  //********SHUFFLE ANSWERS********//
  const shuffleAnswers = (answers) => {
    return answers.sort(() => Math.random() - 0.5);
  };

  //********QUESTION 3:******************************************//
  //********WHAT YEAR THIS ALBUM WAS FIRST RELEASED?********//
  const nameTheYearQuestion = (selectedAlbum) => {
    const yearOfAlbum = parseInt(selectedAlbum.year);
    console.log(yearOfAlbum);
    // console.log('-- NAMETHEYEARQUESTION', selectedAlbum);
    const randomYears = [];
    if (yearOfAlbum <= currentYearInt - 5) {
      randomYears.push(yearOfAlbum - 7);
      randomYears.push(yearOfAlbum + 5);
    } else if (yearOfAlbum === currentYearInt) {
      randomYears.push(yearOfAlbum - 2);
      randomYears.push(yearOfAlbum - 4);
    } else {
      randomYears.push(yearOfAlbum - 3);
      randomYears.push(yearOfAlbum + 1);
    }
    const yearAnswersArray = [...randomYears, yearOfAlbum];
    const shuffledAnswers = shuffleAnswers(yearAnswersArray);
    setYearAnswersArray(shuffledAnswers);
    setAlbumAnswersArray([]);
    setAlbumTrackAnswersArray([]);
  };

  //********CHECK IF ANSWER IS CORRECT********//
  const handleAnswerClick = (answer) => {
    if (
      answer.title === selectedAlbum.title ||
      parseInt(answer) === parseInt(selectedAlbum.year)
    ) {
      setAnswerIsCorrect(true);
      addPoint();
      setQuestionAnswered(true);
    } else {
      // console.log('CORRECT ANSWER', selectedAlbum.year, selectedAlbum.title);
      setQuestionAnswered(true);
      setAnswerIsCorrect(false);
    }
  };

  //********USER CLICKS ON AN ALBUM HANDLING AND SEND ALBUM_ID (ALBUM) AS PROP ********//
  const handleAlbumClick = (album) => {
    setAlbumIsClicked(true);
    getSelectedAlbumDetails(album);
    return;
  };

  return (
    <>
      <Navbar />
      <div className='artist-container'>
        {/*QUIZ SECTION */}
        <h1>{artist.id}</h1>
        <div
          className={
            quizStarted ? 'quiz-container-active' : 'quiz-container-inactive'
          }>
          {!quizStarted && artistAlbumsData.length > 5 && (
            <>
              <h2>
                {quizIsFinished
                  ? `You scored ${score}/5 this time.`
                  : `Fantastic! There is a quiz available to test your knowledge on ${artist.id}:`}
              </h2>
              <button
                onClick={() => {
                  getRandomAlbum();
                  setSelectedAlbumsArray([]);
                  setScore(0);
                  setCount(1);
                }}>
                {quizIsFinished ? 'Take Another Quiz' : 'Start Quiz'}
              </button>
            </>
          )}
          {quizStarted && <h2>Question {count}/5</h2>}
          {/*SELECTED ALBUM COVER_IMAGE RENDERING */}
          {quizStarted && !albumTrackAnswersArray.length > 0 && (
            <div className='selected-album-image-box'>
              <img
                src={selectedAlbum?.cover_image}
                alt={selectedAlbum?.title}
                style={{ width: '250px', height: '250px' }}
              />
            </div>
          )}
          {/* 3 ANSWERS ALBUM COVERS RENDERING */}
          {quizStarted &&
            albumTrackAnswersArray.length > 0 &&
            !albumAnswersArray.length > 0 && (
              <div className='answer-images-box'>
                {albumTrackAnswersArray.map((album) => (
                  <img
                    className={
                      questionAnswered
                        ? album.title === selectedAlbum.title
                          ? 'answer-image-is-correct' // Correct answer
                          : 'answer-image-is-incorrect' // Incorrect answer
                        : '' // Empty class when question hasn't been answered yet
                    }
                    key={album?.id}
                    onClick={() => handleAnswerClick(album)}
                    src={album?.cover_image}
                    alt={album?.title}
                  />
                ))}
              </div>
            )}
          {/* 3 ANSWERS ALBUM_TITLE RENDERING*/}
          {quizStarted &&
            albumAnswersArray.length > 0 &&
            !albumTrackAnswersArray.length > 0 && (
              <div className='question-box'>
                <h3>What is the title of this album?</h3>
                <div className='answers-button-box'>
                  {albumAnswersArray.map((answer, index) => (
                    <button
                      className={
                        questionAnswered
                          ? answer.title === selectedAlbum.title
                            ? 'answer-button-is-correct'
                            : 'answer-button-is-incorrect'
                          : ''
                      }
                      key={index}
                      onClick={(answer) => handleAnswerClick(answer)}
                      disabled={questionAnswered}>
                      {answer.title.replace(/^.*? - /, '').trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          {quizStarted && yearAnswersArray.length > 0 && (
            <div className='question-box'>
              <h3>What year was this album first released?</h3>
              <div className='answers-button-box'>
                {yearAnswersArray.map((answer) => (
                  <button
                    className={
                      questionAnswered
                        ? parseInt(answer) === parseInt(selectedAlbum.year)
                          ? 'answer-button-is-correct'
                          : 'answer-button-is-incorrect'
                        : ''
                    }
                    key={answer}
                    onClick={() => handleAnswerClick(answer)}
                    disabled={questionAnswered}>
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          )}
          {quizStarted && albumTrackAnswersArray.length > 0 && (
            <div className='question-box'>
              <p>"{randomTrack}"</p>
              <h3 id='track-question-h3'>
                This track was released on which of these albums?
              </h3>
            </div>
          )}

          {quizStarted && questionAnswered && nextButtonIsClicked && (
            <button
              id='next-button'
              onClick={() => {
                getRandomAlbum();
                countToFive();
              }}>
              {count !== 5 ? 'Next Question' : 'Check your score'}
            </button>
          )}
        </div>
        {/*END QUIZ SECTION */}

        {/*START OF ALBUM DETAILS*/}
        {/*USER CLICKS ON ALBUM, SHOW DETAILS SECTION */}
        {albumIsClicked && (
          <>
            <div
              className={
                albumIsClicked
                  ? 'album-show-container-active'
                  : 'album-show-container-inactive'
              }>
              <TfiClose
                id='tfi-close'
                onClick={() => setAlbumIsClicked(false)}
                style={{ cursor: 'pointer' }}
              />

              <div className='album-show-primary-image-and-text-box'>
                <div className='album-show-primary-image'>
                  {clickedAlbum?.images?.[0]?.resource_url && (
                    <img
                      key={clickedAlbum.images[0]?.uri}
                      src={clickedAlbum.images[0]?.resource_url}
                      alt={clickedAlbum?.title || 'Image'}
                    />
                  )}
                </div>
                <div className='album-show-text-box'>
                  <h1>{clickedAlbum?.title}</h1>
                  <h1>{clickedAlbum?.artists_sort}</h1>
                  <div className='music-styles'>
                    <h2>
                      {clickedAlbum?.styles?.[0]} {clickedAlbum?.styles?.[1]}
                    </h2>
                  </div>
                  <h2>
                    {clickedAlbum?.year !== 0
                      ? clickedAlbum.year
                      : ''}
                  </h2>
                  <div>
                    <TrackSlider albumTracks={clickedAlbum.tracklist} />
                  </div>
                </div>

                {/*SLIDER FOR TRACK NAME AND POSITION */}
              </div>
              <div className='album-show-secondary-images'>
                {clickedAlbum?.images?.map(
                  (image) =>
                    image.type !== 'primary' && (
                      <img
                        key={image?.uri}
                        src={image?.resource_url}
                        alt={clickedAlbum.title}
                      />
                    )
                )}
              </div>
            </div>
          </>
        )}

        {/*END ALBUM DETAILS*/}

        <AlbumsList
          albums={artistAlbumsData}
          handleAlbumClick={(album) => handleAlbumClick(album)}
        />
      </div>
    </>
  );
};

export default Artist;
