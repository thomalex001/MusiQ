import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Quiz from './components/Quiz';
import Search from './components/Search';
import Artist from './components/Artist';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/search'
          element={<Search />}
        />
        <Route
          path='/artist/:id'
          element={<Artist />}
        />
        <Route
         path='/artist/album/:id'
        element={<Quiz />}
        />
        <Route
          path='*'
          element={<p>Not a valid route</p>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
