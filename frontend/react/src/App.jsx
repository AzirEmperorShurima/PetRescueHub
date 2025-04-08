import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PetGuide from './features/PetGuide/petGuide';
import PetGuideEvents from './features/PetGuide/PetGuideEvents';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pet-guide" element={<PetGuide />} />
        <Route path="/pet-events" element={<PetGuideEvents />} />
        {/* Các routes khác ở đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;