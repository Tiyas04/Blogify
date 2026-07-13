import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout & Pages
import Navbar from './components/navbar';
import Footer from './components/footer';
import Background from './components/Background';
import TiltedMarquee from './components/TiltedMarquee';
import Home from './pages/home';
import Auth from './pages/auth';
import Explore from './pages/Explore';
import BlogDetail from './pages/BlogDetail';
import WritePost from './pages/WritePost';
import Profile from './pages/Profile';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Animated Page Shell
const PageShell = ({ children }) => {
  const location = useLocation();
  return (
    <motion.main
      key={location.pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="grow min-h-[calc(100vh-80px-240px)]" // Adjust min-height based on Navbar (80px) and Footer (approx 240px)
    >
      {children}
    </motion.main>
  );
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary transition-colors duration-300 relative">
      <Background />
      <Navbar />
      
      {/* Top Tilted Marquee Tape */}
      <TiltedMarquee />
      
      <Routes>
        <Route path="/" element={<PageShell><Home /></PageShell>} />
        <Route path="/auth" element={<PageShell><Auth /></PageShell>} />
        <Route path="/explore" element={<PageShell><Explore /></PageShell>} />
        <Route path="/blog/:id" element={<PageShell><BlogDetail /></PageShell>} />
        
        {/* Protected routes */}
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <PageShell>
                <WritePost />
              </PageShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <PageShell>
                <WritePost />
              </PageShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageShell>
                <Profile />
              </PageShell>
            </ProtectedRoute>
          }
        />
        {/* Public profile view */}
        <Route path="/profile/:userId" element={<PageShell><Profile /></PageShell>} />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Bottom Tilted Marquee Tape */}
      <TiltedMarquee />

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
