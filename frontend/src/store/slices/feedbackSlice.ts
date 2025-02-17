import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Feedback, FeedbackState } from '../../types';
import api from '../../services/api';

interface CreateFeedbackData {
  type: string;
  department: string;
  subject: string;
  description: string;
}

const initialState: FeedbackState = {
  feedbacks: [],
  isLoading: false,
  error: null,
};

export const getFeedbacks = createAsyncThunk(
  'feedback/getFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/feedback');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedbacks');
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (data: CreateFeedbackData, { rejectWithValue }) => {
    try {
      const response = await api.post('/feedback', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create feedback');
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Feedbacks
      .addCase(getFeedbacks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedbacks.fulfilled, (state, action: PayloadAction<Feedback[]>) => {
        state.isLoading = false;
        state.feedbacks = action.payload;
        state.error = null;
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Feedback
      .addCase(createFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        state.isLoading = false;
        state.feedbacks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer; 