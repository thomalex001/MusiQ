import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useParams, useNavigate } from 'react-router-dom';
// import QuizCard from './QuizCard';

const Artist = () => {
  const [artistAlbumsData, setArtistAlbumsData] = useState([]);
  const artist = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [randomReleaseData, setRandomReleaseData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [noImageFound, setNoImageFound] = useState(false); // Track if the release has no image


  const isImageValid = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD", mode:"no-cors" });
      return response.ok && response.headers.get("Content-Type").includes("image");
    } catch (e) {
      return false;
    }
  };
  
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
  // console.log('RELEASES', releases);

  const randomRelease = () => {
    if (releases.length > 0) {
      // Step 1: Randomly select the correct release
      const randomIndex = Math.floor(Math.random() * releases.length);
      const selectedRelease = releases[randomIndex];
      console.log('selectedRelease', selectedRelease);
      const isValidImage = isImageValid(selectedRelease.cover_image);
      if (!isValidImage || selectedRelease.cover_image.slice(-10) === "spacer.gif") {
        console.log("Cover image URL INVALID");
        setNoImageFound(true); // Set state to indicate no image is found or invalid
        // Reset loading state when done
        randomRelease();// Stop execution
      }
      // Step 2: Filter out the selected correct release from the options for incorrect answers
      const remainingReleases = releases.filter(
        (release) => release.title.slice(-3) !== selectedRelease.title.slice(-3)
      );
      console.log('remainingReleases', remainingReleases);
      // Step 3: Randomly select 2 incorrect answers from the remaining releases
      const randomIncorrectIndexes = [];
      while (randomIncorrectIndexes.length < 2) {
        const index = Math.floor(Math.random() * remainingReleases.length);
        if (!randomIncorrectIndexes.includes(index)) {
          randomIncorrectIndexes.push(index);
        }
      }
      console.log('randomIncorrectIndexes', randomIncorrectIndexes);

      const incorrectAnswers = randomIncorrectIndexes.map(
        (index) => remainingReleases[index]
      );
      if (
        incorrectAnswers[0].title.length >= 3 &&
        incorrectAnswers[1].title.length >= 3 &&
        incorrectAnswers[0].title.slice(-3) ===
          incorrectAnswers[1].title.slice(-3)
      ) {
        console.log(
          'The last 3 characters are the same. Calling randomRelease again.',
          incorrectAnswers[0].title.slice(-3),
          incorrectAnswers[1].title.slice(-3)
        );
        randomRelease();
        setCorrectAnswer(selectedRelease);
        setIncorrectAnswers(setIncorrectAnswers);
        setQuizStarted(true); // Recurse if titles are too similar
      } else {
        console.log(
          'Quiz options set successfully!',
          incorrectAnswers[0].title.slice(-3),
          incorrectAnswers[1].title.slice(-3)
        );
        // Proceed with your quiz logic here
      }

      // Step 4: Set the state for the correct answer and the incorrect answers
      const allAnswers = [selectedRelease, ...incorrectAnswers];
      // Shuffle answers to make sure the correct answer is not always first
      const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

      setRandomReleaseData(selectedRelease);
      setAnswers(shuffledAnswers); // Set all answers in random order
      setQuizStarted(true); // Start the quiz
    } else {
      console.error('No releases available to choose from!');
    }
  };

  // Function to handle the answer click
  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === randomReleaseData) {
      alert('Correct!');
    } else {
      alert('Incorrect! Try again.');
    }
  };

  return (
    <>
      <div>
        <h1>{artist.name} - Great choice!!!</h1>
        <h2>Now test your knowledge:</h2>
        <button onClick={randomRelease}>Start Quiz</button>
        {quizStarted && (
          <div>
            <h3>Guess the album:</h3>
            <img
              src={randomReleaseData?.cover_image}
              alt={randomReleaseData?.title}
              style={{ width: '250px', height: '250px' }}></img>

            {/* Display the answer buttons */}
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}>
                {answer.title.replace(/^.*? - /, '').trim()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Release Images Section */}
      <div>
        {releases == null || releases.length === 0 ? (
          <p>Loading artist data...</p> // Show loading if releases is null or empty
        ) : (
          <div>
            {releases.map((release) =>
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
