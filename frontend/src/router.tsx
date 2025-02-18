import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SetPassword from './pages/auth/SetPassword';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackHistory from './pages/FeedbackHistory';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/verify-email/:token',
    element: <SetPassword />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout>
          <FeedbackHistory />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout>
          <FeedbackHistory />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/feedback',
    element: (
      <ProtectedRoute>
        <Layout>
          <FeedbackForm />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router; 