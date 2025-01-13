import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';
// import QuizCard from './QuizCard';

const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [yearAnswersArray, setYearAnswersArray] = useState([]);
  const [albumAnswersArray, setAlbumAnswersArray] = useState([]);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState({});
  const [nextButtonIsClicked, setNextButtonIsClicked] = useState(false); 
  const [country, setCountry] = useState('');
  const [albumTrackAnswersArray, setAlbumTrackAnswersArray] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null); // Error state
  const [randomTrack, setRandomTrack] = useState(null);
  const [score, setScore] = useState(0);

  //********GET CURRENT YEAR TO AVOID SHOWING A YEAR IN THE FUTURE IN HANDLE_ANSWER_CLICK********//
  const today = new Date();
  const currentYearStr = `${today.getFullYear()}`;
  const currentYearInt = parseInt(currentYearStr);

  //********SCORING FUNCTIONS********//
  //********COUNTDOWN FROM 5 ********//
  const [count, setCount] = useState(5);
  const countdown = () => {
    if (count < 5) {
      setCount(count + 1);
    } else {
      setQuizStarted(false);
      setCount(1);
    }
  };
  const addPoint = () => {
    setScore((prevScore) => {
      const newScore = prevScore + 1;
      console.log(newScore);
      return newScore;
    });
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

  //********FETCH ALBUM WHEN ARTIST ID CHANGES********//
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
      setArtistAlbumsData(albumsFromTopCountry); // Set all albums from all countries
      setCountry(topCountry.country); // Set the country with the most albums
      setLoading(false);
      // console.log("ALBUMS FROM TOP COUNTRY", albumsFromTopCountry)
    };

    if (artist.id && !country) {
      fetchAlbumsForAllCountries(artist.id);
    }
  }, [artist.id, country]);

  if (loading) return <div>Loading...</div>;
  const albums = artistAlbumsData;

  const gotoAlbum = (albumId) => navigate(`/artist/album/${albumId}`);
  // console.log('ALBUMS', albums);

  //********FUNCTION TO GET ONE RANDOM ALBUM FOR THE QUIZ********//
  const getRandomAlbum = () => {
    if (albums.length > 0) {
      const randomAlbumIndex = Math.floor(Math.random() * albums.length);
      const selectedAlbum = albums[randomAlbumIndex];

      console.log(
        'SELECTED ALBUM',
        selectedAlbum.id,
        ' - ',
        selectedAlbum.title,
        ' - ',
        selectedAlbum.year
      );

      //********CALL EITHER QUESTION 1, 2 or 3.********//
      const randomQuestion = [nameTheAlbumQuestion, nameTheYearQuestion];
      const randomQuestionIndex = Math.floor(Math.random() * 2);
      randomQuestion[randomQuestionIndex](selectedAlbum);

      getSelectedAlbumDetails(selectedAlbum);
      setQuizStarted(true);
      setNextButtonIsClicked(true);
      setQuestionAnswered(false);
      setSelectedAlbum(selectedAlbum);
    }
  };

  //********QUESTION 2: FETCHING******************************************//
  //********WHICH OF THEESE TRACKS APPEAR ON THIS ALBUM?********//
  //********FETCH SELECTED ALBUM DATA FROM GET_ALBUM API********//
  const getSelectedAlbumDetails = async (selectedAlbum) => {
    try {
      // Fetch the albums for the artist and country
      const { data } = await API.GET(API.ENDPOINTS.getAlbum(selectedAlbum.id));
      console.log('SELECTED ALBUM DETAILS:', data);
      // //********EXTRACT ONE TRACK FROM SELECTED ALBUM********//
      const tracklist = data.tracklist || [];

      if (tracklist.length > 0) {
        const randomIndex = Math.floor(Math.random() * tracklist.length);
        const randomTrack = tracklist[randomIndex].title;
        setRandomTrack(randomTrack);
        // console.log('Randomly selected track:', randomTrack);
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
    const remainingAlbums = albums.filter(
      (album) => album.title.slice(-3) !== selectedAlbum.title.slice(-3)
    );

    //********RANDOMLY SELECT TWO INCORRECT ANSWERS********//
    const randomIncorrectAnswers = [];
    while (randomIncorrectAnswers.length < 2) {
      const index = Math.floor(Math.random() * remainingAlbums.length);
      if (!randomIncorrectAnswers.includes(index)) {
        randomIncorrectAnswers.push(index);
      }
    }
    //********ENSURE THE 2 INCORRECT ANSWERS DO NOT HAVE THE SAME TITLE********//
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
    // console.log('ALBUMTRACKARRAY', albumTrackAnswersArray);
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
        console.log('ALBUM'); // Call the second setState function
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
    console.log('-- NAMETHEYEARQUESTION', selectedAlbum);
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
      alert('Correct!');
      setQuestionAnswered(true);
      addPoint();
    } else {
      alert('Incorrect!');
      console.log('CORRECT ANSWER', selectedAlbum.year, selectedAlbum.title);
      setQuestionAnswered(true);
    }
  };
  // console.log(
  //   'TRACK',
  //   albumTrackAnswersArray.length,
  //   'ALBUMM',
  //   albumAnswersArray.length,
  //   'YEAR',
  //   yearAnswersArray.length
  // );

  return (
    <>
      <div>
        {/*QUIZ SECTION */}
        <div>
          <h1>{artist.id}</h1>
          {!quizStarted && artistAlbumsData.length > 5 && (
            <>
              <h2>
                {count === 5
                  ? `Fantastic! There is a quiz available to test your knowledge on ${artist.id}`
                  : `Your score is ${score}/5`}
              </h2>
              <button onClick={getRandomAlbum}>{count === 5 ? 'Start Quiz' : 'Take Another Quiz'}</button>
            </>
          )}
          {quizStarted && (
            <div>
              <p>Question {count}/5</p>
            </div>
          )}
          {/*SELECTED ALBUM COVER_IMAGE RENDERING */}
          {quizStarted && !albumTrackAnswersArray.length > 0 && (
            <div>
              <img
                src={selectedAlbum?.cover_image}
                alt={selectedAlbum?.title}
                style={{ width: '250px', height: '250px' }}
              />
            </div>
          )}
          {/* 3 ANSWERS COVER_IMAGE RENDERING */}
          {quizStarted &&
            albumTrackAnswersArray.length > 0 &&
            !albumAnswersArray.length > 0 && (
              <div>
                {albumTrackAnswersArray.map((album) => (
                  <img
                    key={album?.id}
                    onClick={() => handleAnswerClick(album)}
                    src={album?.cover_image}
                    alt={album?.title}
                    style={{
                      cursor: 'pointer',
                      width: '250px',
                      height: '250px'
                    }}
                  />
                ))}
              </div>
            )}
          {quizStarted &&
            albumAnswersArray.length > 0 &&
            !albumTrackAnswersArray.length > 0 && (
              <div>
                <h3>What is the name of this album?</h3>
                <div>
                  {albumAnswersArray.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(answer)}
                      disabled={questionAnswered}>
                      {answer.title.replace(/^.*? - /, '').trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          {quizStarted && yearAnswersArray.length > 0 && (
            <div>
              <h3>What year was this album first released?</h3>
              <div>
                {yearAnswersArray.map((answer) => (
                  <button
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
            <div>
              <p>{randomTrack}</p>
              <h3>This track was released on which of these albums?</h3>
              <div></div>
            </div>
          )}
          {quizStarted && questionAnswered && nextButtonIsClicked && (
            <button
              onClick={() => {
                getRandomAlbum();
                countdown();
              }}>
              {count === 5 ? 'Check Score' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
      <div>
        {albums == null || albums.length === 0 ? (
          <p>Loading artist data...</p>
        ) : (
          <div>
            {albums.map((album) =>
              album.master_id ? (
                <div key={album.id}>
                  <img
                    onClick={() => gotoAlbum(album.id)}
                    src={album.cover_image}
                    alt={album.title}
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '150px'
                    }}
                  />
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Artist;
