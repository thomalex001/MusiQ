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
  const [selectedAlbum, setSelectedAlbum] = useState({});
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
        
  //********GET ONLY ALBUMS WITH ONE MASTER ID********//
            const seenMasterIds = new Set();
            const uniqueAlbums = [];
            data.results.forEach((album) => {
              if (album.master_id && !seenMasterIds.has(album.master_id)) {
                seenMasterIds.add(album.master_id);
                uniqueAlbums.push(album);
              }
            });
            // console.log('UNIQUE ALBUMS', uniqueAlbums);

  //********FROM UNIQUE ALBUMS, FILTER OUT THE ONES WITH SPACER.GIF AS AN IMAGE*******//
  //* => AS IT SHOWS A SINGLE PIXEL IMAGE********//
          const filteredResults = uniqueAlbums.filter(
            (album) => album.cover_image.slice(-10) !== 'spacer.gif'
          );
          console.log("FILTERED RESULTS",filteredResults)
          setArtistAlbumsData(filteredResults); // Update state with API response
        })
        .catch((e) => console.error(e));
    }
  }, [artist.id]);

  const gotoAlbum = (albumId) => navigate(`/artist/album/${albumId}`);
  const albums = artistAlbumsData;

  //********FUNCTION TO GET ONE RANDOM ALBUM FOR THE QUIZ********//
  const getRandomAlbum = () => {
    if (albums.length > 0) {
      const randomAlbumIndex = Math.floor(Math.random() * albums.length);
      const selectedAlbum = albums[randomAlbumIndex];

      console.log('SELECTED ALBUM', selectedAlbum.id, ' - ', selectedAlbum.title, ' - ', selectedAlbum.year);

      //********CALL EITHER QUESTION 1, 2 or 3.********//
      const randomQuestion = [nameTheAlbumQuestion, nameTheYearQuestion];
      const randomQuestionIndex = Math.floor(Math.random() * 2);
      randomQuestion[randomQuestionIndex](selectedAlbum);
      setQuizStarted(true);
      setNextButtonIsClicked(true)
      setQuestionAnswered(false);
      setSelectedAlbum(selectedAlbum)
    }
  };

  //********QUESTION 1 : WHAT IS THE NAME OF THE ALBUM?********//
  //********FILTER OUT ANSWERS SO THAT REMAINING ALBUMS ARE NOT THE SAME AS SELECTED ALBUM********//
  const nameTheAlbumQuestion = (selectedAlbum) => {
    console.log("-- NAMETHEALBUMQUESTION",)
    const remainingAlbum = albums.filter(
      (album) => album.title.slice(-3) !== selectedAlbum.title.slice(-3)
    );

    //********RANDOMLY SELECTED TWO INCORRECT ANSWERS********//
    const randomIncorrectAnswers = [];
    while (randomIncorrectAnswers.length < 2) {
      const index = Math.floor(Math.random() * remainingAlbum.length);
      if (!randomIncorrectAnswers.includes(index)) {
        randomIncorrectAnswers.push(index);
      }
    }

    //********ENSURE THE 2 INCORRECT ANSWERS DO NOT HAVE THE SAME TITLE********//
    const incorrectAnswers = randomIncorrectAnswers.map(
      (index) => remainingAlbum[index]
    );
    // console.log("COMPARE 3 LAST LETTERS",incorrectAnswers[0].title.slice(-3), incorrectAnswers[1].title.slice(-3))
    if (
      incorrectAnswers[0].title.length >= 3 &&
      incorrectAnswers[1].title.length >= 3 &&
      incorrectAnswers[0].title.slice(-3) === incorrectAnswers[1].title.slice(-3)
    ) {
      console.log("WEIRD CONDITION")
      getRandomAlbum();
      return;
    }

    //********SHUFFLE ANSWERS********//
    const allAnswers = [selectedAlbum, ...incorrectAnswers];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
    setNameAlbumAnswers(shuffledAnswers);
    setNameYearAnswers([])
  };

  //********QUESTION 2 : WHAT YEAR THIS ALBUM WAS FIRST RELEASED?********//
  const nameTheYearQuestion = (selectedAlbum) => {
    const yearOfAlbum = parseInt(selectedAlbum.year);
    console.log('-- NAMETHEYEARQUESTION', selectedAlbum);
    const randomYears = [
      parseInt(yearOfAlbum) - 5,
      parseInt(yearOfAlbum) + 5
    ];
    const nameYearAnswers = [...randomYears, yearOfAlbum];
    setNameYearAnswers(nameYearAnswers);
    setNameAlbumAnswers([]);
  };

  //********CHECK IF ANSWER IS CORRECT********//
  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === selectedAlbum.title || (selectedAnswer === parseInt(selectedAlbum.year))) {
      alert('Correct!');
      setQuestionAnswered(true);
    } else {
      alert('Incorrect! Try again.');
    }
  };




  return (
    <>
    <div>
      {/*QUIZ SECTION */}
      <div>
        <h1>{artist.id} - Great choice!!!</h1>
        <h2>Now test your knowledge:</h2>
        {!quizStarted && (
      <button onClick={getRandomAlbum}>Start Quiz</button>
    )}
        {quizStarted && (
        <div>
          
             <img
              src={selectedAlbum?.cover_image}
              alt={selectedAlbum?.title}
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
            <button onClick={getRandomAlbum}>Next Question</button>
          )}
          { quizStarted && !questionAnswered && setNextButtonIsClicked && (
            <button disabled={nextButtonIsClicked} onClick={getRandomAlbum}>Next Question</button>
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
