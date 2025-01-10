import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';
// import QuizCard from './QuizCard';

const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [randomReleaseData, setRandomReleaseData] = useState(null);
  const [answers, setAnswers] = useState([]);
  // const [selectedRelease, setSelectedRelease] = useState();
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [noImageFound, setNoImageFound] = useState(false); // Track if the release has no image

  //********CHECK IF IMAGE FROM ALBUMS IS A VALID IMAGE********//
  const isImageValid = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return (
        response.ok && response.headers.get('Content-Type').includes('image')
      );
    } catch (e) {
      return false;
    }
  };

  //********GET CHOSEN ARTIST'S ALBUMS********//
  useEffect(() => {
    if (artist.id) {
      API.GET(API.ENDPOINTS.getArtistAlbums(artist.id))
        .then(({ data }) => {
          // console.log('artist data ONE', data);
          setArtistAlbumsData(data); // Update state with API response
        })
        .catch((e) => console.error(e));
    }
  }, [artist.id]);

  const gotoAlbum = (albumId) => navigate(`/artist/album/${albumId}`);
  const releases = artistAlbumsData.results;


  //********FUNCTION TO GET ONE RANDOM RELEASE FOR THE QUIZ********//
  const randomRelease = () => {
    if (releases.length > 0) {
      const randomIndex = Math.floor(Math.random() * releases.length);
      const selectedRelease = releases[randomIndex];
      // console.log('SELECTED RELEASE', selectedRelease);
      const isValidImage = isImageValid(selectedRelease.cover_image);
      if (
        !isValidImage ||
        selectedRelease.cover_image.slice(-10) === 'spacer.gif'
      ) {
        console.log('Cover image URL INVALID');
        setNoImageFound(true);
        return;
      } 
      // setQuestionAnswered();
      nameTheAlbumQuestion(selectedRelease); 
      
    }
  } 
    
  //********QUESTION 1 : WHAT IS THE NAME OF THE ALBUM?********//
  //********FILTER OUT ANSWERS SO THAT REMAINING RELEASES ARE NOT THE SAME AS SELECTED RELEASE********//
  const nameTheAlbumQuestion = (selectedRelease) => {
    const remainingReleases = releases.filter(
      (release) => release.title.slice(-3) !== selectedRelease.title.slice(-3)
    );
    
  //********RANDOMLY SELECTED TWO INCORRECT ANSWERS********//
    const randomIncorrectIndexes = [];
    while (randomIncorrectIndexes.length < 2) {
      const index = Math.floor(Math.random() * remainingReleases.length);
      if (!randomIncorrectIndexes.includes(index)) {
        randomIncorrectIndexes.push(index);
      }
    }

    //********ENSURE THE 2 INCORRECT ANSWERS DO NOT HAVE THE SAME TITLE********//
    const incorrectAnswers = randomIncorrectIndexes.map(
      (index) => remainingReleases[index]
    );
    if (
      incorrectAnswers[0].title.length >= 3 &&
      incorrectAnswers[1].title.length >= 3 &&
      incorrectAnswers[0].title.slice(-3) ===
        incorrectAnswers[1].title.slice(-3)
    ) return 
      // console.log(
      //   'The last 3 characters are the same. Calling randomRelease again.',
      //   incorrectAnswers[0].title.slice(-3),
      //   incorrectAnswers[1].title.slice(-3)
      // );
      // console.log("INCORRECT ANSWERS", incorrectAnswers)
      setCorrectAnswer(selectedRelease);
      setIncorrectAnswers(setIncorrectAnswers);
  //********SHUFFLE ANSWERS********//
      const allAnswers = [selectedRelease, ...incorrectAnswers];
      const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
      setRandomReleaseData(selectedRelease);
      setAnswers(shuffledAnswers);
    
  };

  //********QUESTION 2 : WHAT YEAR THIS ALBUM WAS FIRST RELEASED?********//
  const nameYearOfReleaseQuestion = (randomIndex) => {
    const yearOfRelease = releases[randomIndex].year;
    console.log('YEAR OF RELEASE', yearOfRelease);
    const randomYears = [
      parseInt(yearOfRelease) - 5,
      parseInt(yearOfRelease) + 5
    ];
    console.log('RANDOM YEARS', randomYears);
  };

  //********ON CLICK, CALL EITHER QUESTION 1, 2 or 3.********//
  const getRandomQuestion = () => {
    randomRelease();
    const randomQuestion = [nameTheAlbumQuestion, nameYearOfReleaseQuestion];
    const randomIndex = Math.floor(Math.random() * 2);
    // randomQuestion[randomIndex]();
    
    setQuizStarted(true);
  };

  //********CHECK ANSWER IS CORRECT WHEN CLICKED********//
  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === randomReleaseData) {
      alert('Correct!');
      setQuestionAnswered(true);
    } else {
      alert('Incorrect! Try again.');
    }
  };

  //********FUNCTION TO GET ONLY RELEASES WITH ONE MASTER ID********//
  const getUniqueReleasesByMasterId = (releases) => {
    const seenMasterIds = new Set();
    const uniqueReleases = [];
    releases.forEach((release) => {
      if (release.master_id && !seenMasterIds.has(release.master_id)) {
        seenMasterIds.add(release.master_id);
        uniqueReleases.push(release);
      }
    });
    // console.log('UNIQUE RELEASES', uniqueReleases);
    return uniqueReleases;
  };

  return (
    <>
      {/*QUIZ SECTION */}
      <div>
        <h1>{artist.id} - Great choice!!!</h1>
        <h2>Now test your knowledge:</h2>
        {!quizStarted ? (
          <button onClick={getRandomQuestion}>Start Quiz</button>
        ) : quizStarted && questionAnswered ? (
          <button onClick={getRandomQuestion}>Next Question</button>
        ) : null}
        {quizStarted && (
          <div>
            <h3>What is the name of this album:</h3>
            <img
              src={randomReleaseData?.cover_image}
              alt={randomReleaseData?.title}
              style={{ width: '250px', height: '250px' }}></img>

            {/* DISPLAY THE 3 ANSWERS */}
            <div>
              {answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answer)}>
                  {answer.title.replace(/^.*? - /, '').trim()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RELEASE IMAGES SECTION */}
      <div>
        {releases == null || releases.length === 0 ? (
          <p>Loading artist data...</p>
        ) : (
          <div>
            {getUniqueReleasesByMasterId(releases).map((release) =>
              release.master_id ? (
                <div key={release.id}>
                  <img
                    onClick={() => gotoAlbum(release.id)}
                    src={release.cover_image}
                    alt={release.title}
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
