import { useState, useEffect, useRef } from 'react';
import { API } from '../lib/api';
import { useParams } from 'react-router-dom';
import AlbumsList from './AlbumsList';
import TrackSlider from './common/TrackSlider';
import { TfiClose } from 'react-icons/tfi';
import Navbar from './common/Navbar';
import noDataImage from './../media/no-data-image.png';
import Footer from './Footer';
import { RxInfoCircled } from 'react-icons/rx';
import { Audio } from 'react-loader-spinner';

//********AVPOID SELECTING THE SAME ALBUM TWICE IN GET_RANDOM_ALBUM********//
function getRemainingAlbums(originalData, selectedData) {
  const newArray = [];
  originalData.forEach((album) => {
    if (!selectedData.find((selected) => album.id === selected.id)) {
      newArray.push(album);
    }
  });
  return newArray;
}

const Artist = () => {
  const albumsListRef = useRef(null);

  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const [quizStarted, setQuizStarted] = useState(false);

  const [yearAnswersArray, setYearAnswersArray] = useState([]);
  const [albumTrackAnswersArray, setAlbumTrackAnswersArray] = useState([]);
  const [albumAnswersArray, setAlbumAnswersArray] = useState([]);

  const [selectedAlbum, setSelectedAlbum] = useState({});
  const [selectedAlbumsArray, setSelectedAlbumsArray] = useState([]);
  const [randomTrack, setRandomTrack] = useState(null);

  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [nextButtonIsClicked, setNextButtonIsClicked] = useState(false);

  const [country, setCountry] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAlbumLoading, setIsAlbumLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [quizIsFinished, setQuizIsFinished] = useState(false);
  const [albumIsClicked, setAlbumIsClicked] = useState(false);
  const [clickedAlbum, setClickedAlbum] = useState(false);

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
      getRandomAlbum();
    } else {
      setSelectedAlbumsArray([]);
      setQuizStarted(false);
      setQuizIsFinished(true);
    }
  };

  //********ADD POINTS********//
  const addPoint = () => {
    setScore(score + 1);
  };

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
          }
        });
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
      albumsFromTopCountry = albumsFromAllCountries.filter(
        (album) => album.country === topCountry.country
      );
      setArtistAlbumsData(albumsFromTopCountry);
      setCountry(topCountry.country);
      setIsPageLoading(false);
    };
    if (artist.id && !country) {
      fetchAlbumsForAllCountries(artist.id);
    }
  }, [artist.id, country]);

  //********FUNCTION TO GET ONE RANDOM ALBUM FOR THE QUIZ********//
  const getRandomAlbum = () => {
    if (artistAlbumsData.length > 0) {
      let selectedAlbum;
      if (selectedAlbumsArray.length === 0) {
        // for first question
        const randomAlbumIndex = Math.floor(
          Math.random() * artistAlbumsData.length
        );
        selectedAlbum = artistAlbumsData[randomAlbumIndex];
        setSelectedAlbumsArray([selectedAlbum]);
      } else {
        const leftoverAlbums = getRemainingAlbums(
          artistAlbumsData,
          selectedAlbumsArray
        );

        const randomAlbumIndex = Math.floor(
          Math.random() * leftoverAlbums.length
        );
        selectedAlbum = leftoverAlbums[randomAlbumIndex];
        setSelectedAlbumsArray((prevSelectedAlbums) => [
          ...prevSelectedAlbums,
          selectedAlbum
        ]);
      }

      if (!selectedAlbum.year) {
        getRandomAlbum();
        return;
      }

      //********STORE SELECTED ALBUMS IN AN ARRAY EACH TIME A QUESTION...********//
      //********...IS ANSWERED AND CHECK FOR DUPLICATES********//

      getSelectedAlbumDetails(selectedAlbum);
      setRandomTrack([]);

      //********CALL EITHER QUESTION 1, 2 or 3.********//
      const randomChoice = Math.random();
      if (randomChoice < 0.33) {
        nameTheYearQuestion(selectedAlbum);
      } else {
        nameTheAlbumQuestion(selectedAlbum);
      }
      setQuizStarted(true);
      setQuizIsFinished(false);
      setNextButtonIsClicked(true);
      setQuestionAnswered(false);
      setSelectedAlbum(selectedAlbum);
    }
  };

  //********QUESTION 3: FETCHING******************************************//
  //********NAME THE ALBUM FROM THE TRACK******************//
  //********FETCH SELECTED ALBUM DATA FROM GET_ALBUM API******************//
  const getSelectedAlbumDetails = async (selectedAlbum) => {
    setIsAlbumLoading(true);

    try {
      const { data } = await API.GET(API.ENDPOINTS.getAlbum(selectedAlbum.id));
      //********EXTRACT ONE TRACK FROM SELECTED ALBUM********//
      const tracklist = data.tracklist || [];
      //********STORE ALBUM_ID DETAILS IN SET_CLICKED_ALBUM WHEN ALBUM IS CLICKED BY USER*******//
      setClickedAlbum(data);

      if (tracklist.length > 0) {
        const randomIndex = Math.floor(Math.random() * tracklist.length);
        const randomTrack = tracklist[randomIndex].title;
        setRandomTrack(randomTrack);
      } else {
      }
    } catch (error) {}
    setIsAlbumLoading(false);
  };

  //********QUESTION 1 & 2 :******************************************//
  //********WHAT IS THE NAME OF THE ALBUM?********//
  //*******WHAT YEAR THIS ALBUM WAS FIRST RELEASED?********//
  //********FILTER OUT ANSWERS SO THAT REMAINING ALBUMS ARE NOT THE SAME AS SELECTED ALBUM********//
  const nameTheAlbumQuestion = (selectedAlbum) => {
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
    setTimeOut(false);
    if (
      answer.title === selectedAlbum.title ||
      parseInt(answer) === parseInt(selectedAlbum.year)
    ) {
      addPoint();
    }
    setQuestionAnswered(true);

    setTimeout(() => {
      setTimeOut(true);
    }, 1500);
  };

  //********USER CLICKS ON AN ALBUM HANDLING AND SEND ALBUM_ID (ALBUM) AS PROP, ALSO SCROLL TO ALBUM SHOW ELEMENT ********//
  const handleAlbumClick = (album) => {
    setClickedAlbum([]);
    setAlbumIsClicked(true);
    getSelectedAlbumDetails(album);
    if (albumsListRef.current) {
      albumsListRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
    return;
  };

  if (isPageLoading) return <div className='loader'></div>;

  return (
    <>
      <Navbar />
      <fieldset className='main artist-container'>
        {/*QUIZ SECTION */}
        <legend id='artist-legend'>{artist.id}</legend>
        {artistAlbumsData.length === 0 && (
          <div className='no-data-container'>
            <p>
              Sorry, we couldn't find any data for {artist.id}... Please reload
              the page or try a new search.
            </p>
            <img
              src={noDataImage}
              alt={'pianist-sad'}
            />
          </div>
        )}
        {artistAlbumsData.length <= 4 && artistAlbumsData.length !== 0 && (
          <div className='less-than-5-albums-container'>
            <h2>
              Nice find!<br></br>The number of albums for {artist.id} is too low
              to load a quiz but you can still click on the covers below for
              more details.
            </h2>
          </div>
        )}

        <div
          className={
            quizStarted ? 'quiz-container is-active' : 'quiz-container'
          }>
          {!quizStarted && artistAlbumsData.length >= 5 && (
            <div className='quiz-inner-container'>
              {!quizIsFinished && <RxInfoCircled id='info-icon' />}
              <div className='show-info'>
                <p>
                  Discogs albums data is added by its users, it is mostly
                  accurate but not 100% which means that you may find some
                  answers to be incorrect.
                </p>
              </div>
              <div>
                {quizIsFinished ? (
                  <h2 className='score-h2'>You scored {score}/5 this time.</h2>
                ) : (
                  <h2 className='quiz-available-h2'>
                    Fantastic!
                    <br /> There is a quiz available to test your knowledge on{' '}
                    {artist.id}:
                  </h2>
                )}
                <button
                  id='start-quiz-button'
                  onClick={() => {
                    getRandomAlbum();
                    setScore(0);
                    setCount(1);
                    setAlbumIsClicked(false);
                  }}>
                  {quizIsFinished ? 'Take Another Quiz' : 'Start Quiz'}
                </button>
              </div>
            </div>
          )}

          {quizStarted && (
            <>
              <h2>Question {count}/5</h2>
            </>
          )}
          {/*SELECTED ALBUM COVER_IMAGE RENDERING */}

          {quizStarted && !albumTrackAnswersArray.length > 0 && (
            <div className='selected-album-image-box'>
              <img
                src={selectedAlbum?.cover_image}
                alt={selectedAlbum?.title}
              />
            </div>
          )}
          {/* 3 ANSWERS ALBUM COVERS RENDERING */}
          {quizStarted &&
            albumTrackAnswersArray.length > 0 &&
            !albumAnswersArray.length > 0 &&
            randomTrack.length > 0 && (
              <div className='answer-images-box'>
                {albumTrackAnswersArray.map((album) => (
                  <img
                    className={
                      questionAnswered
                        ? album.title === selectedAlbum.title
                          ? 'answer-image-is-correct'
                          : 'answer-image-is-incorrect'
                        : ''
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
                  {albumAnswersArray.map((answer, index) => {
                    return (
                      <button
                        id='album-title-buttons'
                        className={
                          questionAnswered
                            ? answer.title === selectedAlbum.title
                              ? 'answer-button-is-correct'
                              : 'answer-button-is-incorrect'
                            : ''
                        }
                        key={index}
                        onClick={() => handleAnswerClick(answer)}
                        disabled={questionAnswered}>
                        {answer.title.replace(/^.*? - /, '').trim()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          {/* 3 ANSWERS ALBUM_YEAR RENDERING*/}
          {quizStarted && yearAnswersArray.length > 0 && (
            <div className='question-box'>
              <h3>What year was this album first released?</h3>
              <div className='answers-button-box'>
                {yearAnswersArray.map((answer) => (
                  <button
                    id='year-buttons'
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
              {randomTrack.length > 0 && (
                <>
                  <p>"{randomTrack}"</p>
                  <h3 id='track-question-h3'>
                    This track was released on which of these albums?
                  </h3>
                </>
              )}
            </div>
          )}

          {quizStarted &&
            questionAnswered &&
            nextButtonIsClicked &&
            timeOut && (
              <button
                id='next-button'
                onClick={() => {
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
          <div
            ref={albumsListRef}
            className={
              albumIsClicked
                ? 'album-show-container is-active'
                : 'album-show-container'
            }>
            <TfiClose
              id='tfi-close'
              onClick={() => setAlbumIsClicked(false)}
              style={{ cursor: 'pointer' }}
            />
            <div className='album-show-primary-image-and-text-box'>
              {isAlbumLoading ? (
                <Audio
                  height='80'
                  width='80'
                  radius='9'
                  color='lightblue'
                  ariaLabel='loading'
                  wrapperClass='audio-loader'
                />
              ) : (
                <>
                  <div className='album-show-primary-image-box'>
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
                    <h2>{clickedAlbum?.artists_sort}</h2>
                    <div className='music-styles'>
                      <h3>
                        {clickedAlbum?.styles?.[0]} {clickedAlbum?.styles?.[1]}
                      </h3>
                    </div>
                    <h3>{clickedAlbum?.year !== 0 ? clickedAlbum.year : ''}</h3>
                    <TrackSlider albumTracks={clickedAlbum.tracklist} />
                  </div>
                </>
              )}
            </div>
            {/* Secondary Images */}
            <div className='album-show-secondary-images'>
              {clickedAlbum?.images?.map((image) =>
                image.type !== 'primary' && image?.resource_url ? (
                  <img
                    key={image?.uri}
                    src={image?.resource_url}
                    alt={clickedAlbum.title}
                  />
                ) : null
              )}
            </div>
          </div>
        )}
        {/*END ALBUM DETAILS*/}
        <AlbumsList
          albums={artistAlbumsData}
          handleAlbumClick={(album) => handleAlbumClick(album)}
          disabled={quizStarted}
        />
      </fieldset>
      <Footer />
    </>
  );
};

export default Artist;