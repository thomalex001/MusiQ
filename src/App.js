import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Search from './components/Search';
import Artist from './components/Artist';
import About from './components/About';
import TheClash from './media/the-clash.jpg'


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/search" />} />
        <Route
          path='/search'
          element={<Search />}
        />
        <Route
          path='/artist/:id'
          element={<Artist />}
        />
        <Route
          path='/about'
          element={<About />}
        />
        <Route
          path='*'
          element={<div className='page-not-found'>
            <p>Sorry, this page doesn't exist...</p>
            <img src={TheClash} alt='the-clash-smashing-guitar'/>
          </div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
