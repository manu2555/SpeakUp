import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface StatsState {
  totalUsers: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  totalUsers: 0,
  isLoading: false,
  error: null,
};

export const getTotalUsers = createAsyncThunk(
  'stats/getTotalUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/total-users');
      return response.data.count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total users');
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalUsers = action.payload;
        state.error = null;
      })
      .addCase(getTotalUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default statsSlice.reducer; 