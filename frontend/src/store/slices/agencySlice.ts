import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Agency {
  id: string;
  code: string;
  name: string;
  department: string;
  customer_care_email: string;
}

interface AgencyState {
  agencies: Agency[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AgencyState = {
  agencies: [],
  isLoading: false,
  error: null,
};

export const getAgencies = createAsyncThunk(
  'agencies/getAgencies',
  async (department: string | undefined, { rejectWithValue }) => {
    try {
      const response = await api.get('/agencies', {
        params: { department }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch agencies');
    }
  }
);

const agencySlice = createSlice({
  name: 'agencies',
  initialState,
  reducers: {
    clearAgencies: (state) => {
      state.agencies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAgencies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAgencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.agencies = action.payload;
        state.error = null;
      })
      .addCase(getAgencies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAgencies } = agencySlice.actions;
export default agencySlice.reducer; 