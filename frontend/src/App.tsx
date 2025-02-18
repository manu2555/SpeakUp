import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import store from './store';
import { useAppDispatch, useAppSelector } from './hooks';
import { checkSession, getMe } from './store/slices/authSlice';
import router from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

const SessionManager = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initial session check and user data fetch
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  useEffect(() => {
    // Check session status every minute
    const checkSessionStatus = () => {
      dispatch(checkSession());
    };

    // Initial check
    checkSessionStatus();

    // Set up periodic checks
    const interval = setInterval(checkSessionStatus, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <CssBaseline />
            <SessionManager />
            <RouterProvider router={router} />
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
