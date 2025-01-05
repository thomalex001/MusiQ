import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Search from './components/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/search'
          element={<Search/>}
        />
        <Route
          path='/'
          element={<Home />}
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
