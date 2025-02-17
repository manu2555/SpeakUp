import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setAuthToken, removeAuthToken } from '../../utils/auth';

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: number | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  sessionExpiry: localStorage.getItem('sessionExpiry') ? Number(localStorage.getItem('sessionExpiry')) : null
};

// Helper function to set session expiry
const setSessionExpiry = () => {
  const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
  localStorage.setItem('sessionExpiry', expiryTime.toString());
  return expiryTime;
};

// Helper function to clear session
const clearSession = () => {
  localStorage.removeItem('token');
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

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Set token in localStorage and axios headers
      localStorage.setItem('token', token);
      setAuthToken(token);

      // Set session expiry
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
      localStorage.setItem('sessionExpiry', expiryTime.toString());

      return { token, user, sessionExpiry: expiryTime };
    } catch (error: any) {
      // Clear any existing session data on login failure
      clearSession();
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      setAuthToken(token);
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
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
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionExpiry = setSessionExpiry();
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
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

export const { checkSession } = authSlice.actions;
export default authSlice.reducer; 