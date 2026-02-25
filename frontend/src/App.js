import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ConfigProvider } from 'antd';

// Components
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';
import CategoryPage from './pages/CategoryPage';
import Phonebook from './pages/Phonebook';

const queryClient = new QueryClient();

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/complete-profile" 
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/phonebook" 
        element={
          <ProtectedRoute>
            <Phonebook />
          </ProtectedRoute>
        } 
      />
      <Route 
      path="/category/:category"
        element={
          <ProtectedRoute>
            <CategoryPage  />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-post" 
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <AppContent />
              <Toaster position="top-right" />
            </div>
          </AuthProvider>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;