import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';
// import QuizCard from './QuizCard';

const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [nameYearAnswers, setNameYearAnswers] = useState([]);
  const [nameAlbumAnswers, setNameAlbumAnswers] = useState([]);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState({});
  const [nextButtonIsClicked, setNextButtonIsClicked] = useState(false); 

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

  //********GET CHOSEN ARTIST'S ALBUMS********//
  useEffect(() => {
    if (artist.id) {
      API.GET(API.ENDPOINTS.getArtistAlbums(artist.id))
        .then(({ data }) => {
          // console.log('DATA', data);
          const filteredResults = data.results.filter(
            (result) => result.cover_image.slice(-10) !== 'spacer.gif'
          );
          // console.log("FILTERED RESULTS",filteredResults)
          

          setArtistAlbumsData(filteredResults); // Update state with API response
        })
        .catch((e) => console.error(e));
    }
  }, [artist.id]);

  const gotoAlbum = (albumId) => navigate(`/artist/album/${albumId}`);
  const releases = artistAlbumsData;

  //********FUNCTION TO GET ONE RANDOM RELEASE FOR THE QUIZ********//
  const getRandomRelease = () => {
    if (releases.length > 0) {
      const randomReleaseIndex = Math.floor(Math.random() * releases.length);
      const selectedRelease = releases[randomReleaseIndex];

      console.log('SELECTED RELEASE', selectedRelease.id, ' - ', selectedRelease.title, ' - ', selectedRelease.year);

      //********CALL EITHER QUESTION 1, 2 or 3.********//
      const randomQuestion = [nameTheAlbumQuestion, nameTheYearQuestion];
      const randomQuestionIndex = Math.floor(Math.random() * 2);
      randomQuestion[randomQuestionIndex](selectedRelease);
      // nameYearOfReleaseQuestion(selectedRelease)
      setQuizStarted(true);
      setNextButtonIsClicked(true)
      setQuestionAnswered(false);
      setSelectedRelease(selectedRelease)
    }
  };

  //********QUESTION 1 : WHAT IS THE NAME OF THE ALBUM?********//
  //********FILTER OUT ANSWERS SO THAT REMAINING RELEASES ARE NOT THE SAME AS SELECTED RELEASE********//
  const nameTheAlbumQuestion = (selectedRelease) => {
    console.log("-- NAMETHEALBUMQUESTION",)
    const remainingReleases = releases.filter(
      (release) => release.title.slice(-3) !== selectedRelease.title.slice(-3)
    );

    //********RANDOMLY SELECTED TWO INCORRECT ANSWERS********//
    const randomIncorrectAnswers = [];
    while (randomIncorrectAnswers.length < 2) {
      const index = Math.floor(Math.random() * remainingReleases.length);
      if (!randomIncorrectAnswers.includes(index)) {
        randomIncorrectAnswers.push(index);
      }
    }

    //********ENSURE THE 2 INCORRECT ANSWERS DO NOT HAVE THE SAME TITLE********//
    const incorrectAnswers = randomIncorrectAnswers.map(
      (index) => remainingReleases[index]
    );
    // console.log("COMPARE 3 LAST LETTERS",incorrectAnswers[0].title.slice(-3), incorrectAnswers[1].title.slice(-3))
    if (
      incorrectAnswers[0].title.length >= 3 &&
      incorrectAnswers[1].title.length >= 3 &&
      incorrectAnswers[0].title.slice(-3) === incorrectAnswers[1].title.slice(-3)
    ) {
      console.log("WEIRD CONDITION")
      getRandomRelease();
      return;
    }

    //********SHUFFLE ANSWERS********//
    const allAnswers = [selectedRelease, ...incorrectAnswers];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
    setNameAlbumAnswers(shuffledAnswers);
    setNameYearAnswers([])
  };

  //********QUESTION 2 : WHAT YEAR THIS ALBUM WAS FIRST RELEASED?********//
  const nameTheYearQuestion = (selectedRelease) => {
    const yearOfRelease = parseInt(selectedRelease.year);
    console.log('-- NAMETHEYEARQUESTION', selectedRelease);
    const randomYears = [
      parseInt(yearOfRelease) - 5,
      parseInt(yearOfRelease) + 5
    ];
    const nameYearAnswers = [...randomYears, yearOfRelease];
    setNameYearAnswers(nameYearAnswers);
    setNameAlbumAnswers([]);
  };

  // const nameYearOfReleaseQuestion = (randomIndex) => {
  //   const yearOfRelease = releases[randomIndex].year;
  //   console.log('YEAR OF RELEASE', yearOfRelease);
  //   const randomYears = [
  //     parseInt(yearOfRelease) - 5,
  //     parseInt(yearOfRelease) + 5
  //   ];
  //   console.log('RANDOM YEARS', randomYears);
  // };

  //********CHECK IF ANSWER IS CORRECT********//
  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === selectedRelease.title || (selectedAnswer === parseInt(selectedRelease.year))) {
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
    <div>
      {/*QUIZ SECTION */}
      <div>
        <h1>{artist.id} - Great choice!!!</h1>
        <h2>Now test your knowledge:</h2>
        {!quizStarted && (
      <button onClick={getRandomRelease}>Start Quiz</button>
    )}
        {quizStarted && (
        <div>
             <img
              src={selectedRelease?.cover_image}
              alt={selectedRelease?.title}
              style={{ width: '250px', height: '250px' }}
            />
        </div>
        )}
        
        {quizStarted && nameAlbumAnswers.length > 0 && (
          <div>
             <h3>What is the name of this album?</h3>
            <div>
              {nameAlbumAnswers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answer)}>
                  {answer.title.replace(/^.*? - /, '').trim()}
                </button>
              ))}
            </div>
          </div>
        )}
        {quizStarted && nameYearAnswers.length > 0 && (
          <div>
            <h3>What year was this album first released?</h3>
            <div>
            {nameYearAnswers.map((answer) => (
              <button
                key={answer}
                onClick={() => handleAnswerClick(answer)}>
                {answer}
              </button>
            ))}
          </div>
          </div>
        )}
          {quizStarted && questionAnswered && setNextButtonIsClicked &&(
            <button onClick={getRandomRelease}>Next Question</button>
          )}
          { quizStarted && !questionAnswered && setNextButtonIsClicked && (
            <button disabled={nextButtonIsClicked} onClick={getRandomRelease}>Next Question</button>
          )}
      </div>
    </div>
    
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
