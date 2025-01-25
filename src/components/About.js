import Navbar from './common/Navbar';
import Contact from './../components/Contact'

export default function About() {
  return (
    <>
      <Navbar />
      <div className='main'>
        <div className='search-page'>
          <h1>MusiQ App</h1>
          <h2>
            Data provided by{' '}
            <a
              href='https://www.discogs.com/developers/'
              target='_blank'
              rel='noreferrer'>
              Discogs
            </a>{' '}
            for developers
          </h2>
          <div className='about-text'>
            <h1>Overview</h1>
            <p>
              MusiQ App is a website that allows you to search for your favorite
              music Artists or Bands and test your knowledge with a tailored
              Quiz.
            </p>
            <h1>Quiz Data</h1>
            <p>
              Provided that there are 5 (or more) albums for your chosen Artist,
              a Quiz will be available. Should there be less than 5 albums,
              unfortunately this is not enough data to load a quiz but you will
              still be able to see those albums on the Artist’s page and click
              on each Album Cover for more details (i.e. Album Title, Year,
              Tracklist etc…).
            </p>
            <h1>Start Quiz</h1>
            <p>
              To test your knowledge on your chosen Artist simply click on
              “Start Quiz” on the Artist’s page. You will have 5 consecutive
              random questions based on the data provided by Discogs API (see
              information below). Once you will have completed the quiz, your
              score will be shown and you will be able to click on “Take Another
              Quiz” which will load 5 more random questions.
            </p>
            <h1>API</h1>
            <p>Please see below the Discogs’s API used for this website: </p>
            <div className='api-links'>
              <code>https://api.discogs.com/database/search</code>
              <code>https://api.discogs.com/releases/</code>
            </div>

            <p>
              For more information on how to access Discogs API please visit:
            </p>
            <div className='api-links'>
              <p>
                <a
                  href='https://www.discogs.com/developers/'
                  target='_blank'
                  rel='noreferrer'>
                  https://www.discogs.com/developers/
                </a>{' '}
              </p>
            </div>
            <p id='about-last-p'>
              {' '}
              I hope that you will enjoy searching and quizzing, have fun!
            </p>
          </div>
        </div>
      </div>
      <Contact />
    </>
  );
}
