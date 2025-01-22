import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          path='*'
          element={<p>This page doesn't exist...</p>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
