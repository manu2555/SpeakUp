import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Feedback, FeedbackState } from '../../types';
import api from '../../services/api';

export interface CreateFeedbackData {
  type: string;
  department: string;
  agency: string;
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
  async (data: FormData | CreateFeedbackData, { rejectWithValue }) => {
    try {
      const response = await api.post('/feedback', data, {
        headers: data instanceof FormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create feedback');
    }
  }
);

export const updateFeedback = createAsyncThunk(
  'feedback/updateFeedback',
  async (data: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/feedback/${data.id}`, data.formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update feedback');
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/deleteFeedback',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/feedback/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete feedback');
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
      })
      // Update Feedback
      .addCase(updateFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        state.isLoading = false;
        state.feedbacks = state.feedbacks.map(feedback =>
          feedback.id === action.payload.id ? action.payload : feedback
        );
        state.error = null;
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.feedbacks = state.feedbacks.filter(feedback => feedback.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer; 