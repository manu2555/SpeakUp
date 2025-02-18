import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setAuthToken, removeAuthToken } from '../../utils/auth';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: number | null;
  verifiedUser: User | null;
}

// Load persisted state from localStorage
const loadPersistedState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const sessionExpiry = localStorage.getItem('sessionExpiry');

    return {
      token,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token,
      sessionExpiry: sessionExpiry ? Number(sessionExpiry) : null,
    };
  } catch (error) {
    console.error('Error loading persisted state:', error);
    return null;
  }
};

const persistedState = loadPersistedState();

const initialState: AuthState = {
  user: persistedState?.user || null,
  token: persistedState?.token || null,
  isAuthenticated: persistedState?.isAuthenticated || false,
  isLoading: false,
  error: null,
  sessionExpiry: persistedState?.sessionExpiry || null,
  verifiedUser: null,
};

// Helper function to set session expiry
const setSessionExpiry = () => {
  const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
  localStorage.setItem('sessionExpiry', expiryTime.toString());
  return expiryTime;
};

// Helper function to persist auth state
const persistAuthState = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  const expiryTime = setSessionExpiry();
  localStorage.setItem('sessionExpiry', expiryTime.toString());
  setAuthToken(token);
};

// Helper function to clear session
const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('sessionExpiry');
  removeAuthToken();
};

// Async thunks
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      clearSession();
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

export const initiateRegistration = createAsyncThunk(
  'auth/initiateRegistration',
  async (userData: { name: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      // Extract the most meaningful error message
      const errorMessage = error.response?.data?.details || 
                         error.response?.data?.message || 
                         error.message || 
                         'Registration failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                         'Email verification failed. Please try registering again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const setPassword = createAsyncThunk(
  'auth/setPassword',
  async (data: { userId: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/set-password', data);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      persistAuthState(token, user);
      return { token, user, sessionExpiry: setSessionExpiry() };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set password');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      persistAuthState(token, user);
      return { token, user, sessionExpiry: setSessionExpiry() };
    } catch (error: any) {
      clearSession();
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      clearSession();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updateData: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkSession: (state) => {
      if (state.sessionExpiry && Date.now() > state.sessionExpiry) {
        clearSession();
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionExpiry = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionExpiry = null;
      })
      // Initiate Registration
      .addCase(initiateRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiateRegistration.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initiateRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.verifiedUser = action.payload.user;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Set Password
      .addCase(setPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionExpiry = action.payload.sessionExpiry;
        state.verifiedUser = null;
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionExpiry = action.payload.sessionExpiry;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionExpiry = null;
        state.error = null;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { checkSession, clearError } = authSlice.actions;
export default authSlice.reducer; 