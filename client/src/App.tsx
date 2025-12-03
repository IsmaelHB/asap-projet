import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedArtisanRoute from '@/components/layout/ProtectedArtisanRoute';

// Public pages
import HomePage from './pages/artisan/HomePage';
import SearchResultsPage from './pages/artisan/SearchResultsPage';
import ArtisanProfilePage from './pages/ArtisanProfilePage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

// Static pages
import AboutPage from './pages/static/AboutPage';
import HowItWorksPage from './pages/static/HowItWorksPage';
import LegalPage from './pages/static/LegalPage';
import NotFoundPage from './pages/NotFoundPage';

// Artisan pages
import LoginPage from './pages/artisan/LoginPage';
import DashboardPage from './pages/artisan/DashboardPage';
import ProfilePage from './pages/artisan/ProfilePage';
import ServicesPage from './pages/artisan/ServicesPage';
import AvailabilityPage from './pages/artisan/AvailabilityPage';
import AppointmentsPage from './pages/artisan/AppointmentsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/artisan/:slug" element={<ArtisanProfilePage />} />
          <Route
            path="/booking/confirm/:appointmentId"
            element={<BookingConfirmationPage />}
          />

          {/* Static pages */}
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
          <Route path="/cgu" element={<LegalPage />} />
          <Route path="/conditions-generales" element={<LegalPage />} />

          {/* Artisan login (public) */}
          <Route path="/artisan-login" element={<LoginPage />} />

          {/* Artisan routes (protected) */}
          <Route
            path="/artisan/dashboard"
            element={
              <ProtectedArtisanRoute>
                <DashboardPage />
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/profile"
            element={
              <ProtectedArtisanRoute>
                <ProfilePage />
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/services"
            element={
              <ProtectedArtisanRoute>
                <ServicesPage />
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/availability"
            element={
              <ProtectedArtisanRoute>
                <AvailabilityPage />
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/appointments"
            element={
              <ProtectedArtisanRoute>
                <AppointmentsPage />
              </ProtectedArtisanRoute>
            }
          />

          {/* 404 - Must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
