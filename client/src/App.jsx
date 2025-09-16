
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FavoritesPage from './pages/FavoritesPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';
import { Box } from '@mui/material';


function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe/:recipeId" element={<RecipePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/favorites" 
            element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} 
          />
         <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Box>
  );
}

export default App;