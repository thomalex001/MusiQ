import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';
// import QuizCard from './QuizCard';

const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [nameYearAnswers, setNameYearAnswers] = useState(false);
  const [nameAlbumAnswers, setNameAlbumAnswers] = useState([]);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [randomReleaseData, setRandomReleaseData] = useState(null);

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
  const getRandomRelease = () => {
    if (releases.length > 0) {
      const randomReleaseIndex = Math.floor(Math.random() * releases.length);
      const selectedRelease = releases[randomReleaseIndex];
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
      // nameTheAlbumQuestion(selectedRelease);
      //********CALL EITHER QUESTION 1, 2 or 3.********//
      const randomQuestion = [nameTheAlbumQuestion, nameTheYearQuestion];
      const randomQuestionIndex = Math.floor(Math.random() * 2);
      randomQuestion[randomQuestionIndex](selectedRelease);
      // nameYearOfReleaseQuestion(selectedRelease)
      setQuizStarted(true);
    }
  };

  //********QUESTION 1 : WHAT IS THE NAME OF THE ALBUM?********//
  //********FILTER OUT ANSWERS SO THAT REMAINING RELEASES ARE NOT THE SAME AS SELECTED RELEASE********//
  const nameTheAlbumQuestion = (selectedRelease) => {
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
    if (
      incorrectAnswers[0].title.length >= 3 &&
      incorrectAnswers[1].title.length >= 3 &&
      incorrectAnswers[0].title.slice(-3) ===
        incorrectAnswers[1].title.slice(-3)
    )
      return;
    // console.log(
    //   'The last 3 characters are the same. Calling randomRelease again.',
    //   incorrectAnswers[0].title.slice(-3),
    //   incorrectAnswers[1].title.slice(-3)
    // );
    // console.log("INCORRECT ANSWERS", incorrectAnswers)
    setCorrectAnswer(selectedRelease);
    // setIncorrectAnswers(setIncorrectAnswers);
    //********SHUFFLE ANSWERS********//
    const allAnswers = [selectedRelease, ...incorrectAnswers];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
    console.log("SHUFFLED ANSWERS", shuffledAnswers);
    setRandomReleaseData(selectedRelease);
    setNameAlbumAnswers(shuffledAnswers);
  };

  //********QUESTION 2 : WHAT YEAR THIS ALBUM WAS FIRST RELEASED?********//
  const nameTheYearQuestion = (selectedRelease) => {
    const yearOfRelease = parseInt(selectedRelease.year);
    // console.log('YEAR OF RELEASE', yearOfRelease);
    const randomYears = [
      parseInt(yearOfRelease) - 5,
      parseInt(yearOfRelease) + 5
    ];
    const nameYearAnswers = [...randomYears, yearOfRelease];
    nameYearAnswers.map((year) => console.log('NAMEYEARANSWERS', year));
    setNameYearAnswers(nameYearAnswers);
    setRandomReleaseData(selectedRelease);

    // console.log('RANDOM YEARS', randomYears);
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
    console.log("RANDOMRELEASEDATA.YEAR", typeof(randomReleaseData.year))
    console.log("SELECTED ANSWER", typeof(selectedAnswer))
    if (selectedAnswer === randomReleaseData || (selectedAnswer === parseInt(randomReleaseData.year))) {
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
              src={randomReleaseData?.cover_image}
              alt={randomReleaseData?.title}
              style={{ width: '250px', height: '250px' }}
            />
        </div>
        )}
        
        {quizStarted && !nameYearAnswers && nameAlbumAnswers?.length > 0 && (
          <div>
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
        {quizStarted &&  nameYearAnswers?.length > 0 && (
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
          {quizStarted && questionAnswered && (
            <button onClick={getRandomRelease}>Next Question</button>
          )}
      </div>
    </div>

      // {/* DISPLAY THE 3 ANSWERS */}

    // {/* RELEASE IMAGES SECTION */}
    //   <div>
    //     {releases == null || releases.length === 0 ? (
    //       <p>Loading artist data...</p>
    //     ) : (
    //       <div>
    //         {getUniqueReleasesByMasterId(releases).map((release) =>
    //           release.master_id ? (
    //             <div key={release.id}>
    //               <img
    //                 onClick={() => gotoAlbum(release.id)}
    //                 src={release.cover_image}
    //                 alt={release.title}
    //                 style={{
    //                   cursor: 'pointer',
    //                   width: '150px',
    //                   height: '150px'
    //                 }}
    //               />
    //             </div>
    //           ) : null
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </>
  );
};

export default Artist;
