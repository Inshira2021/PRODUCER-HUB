import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProducerLogin from './components/ProducerLogin';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AddMovie from './pages/AddMovie';
import MovieDetail from './pages/MovieDetail';
import AddTrailer from './pages/AddTrailer';
import TrailerDetail from './pages/TrailerDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<ProducerLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movie/:id/add-trailer" element={<AddTrailer />} />
        <Route path="/movie/:id/trailer/:trailerId" element={<TrailerDetail />} />
        
        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
