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
  selectedAgency: Agency | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AgencyState = {
  agencies: [],
  selectedAgency: null,
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

export const getAgencyByCode = createAsyncThunk(
  'agencies/getAgencyByCode',
  async ({ department, code }: { department: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/agencies/${code}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch agency details');
    }
  }
);

const agencySlice = createSlice({
  name: 'agencies',
  initialState,
  reducers: {
    clearAgencies: (state) => {
      state.agencies = [];
      state.selectedAgency = null;
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
      })
      .addCase(getAgencyByCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAgencyByCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAgency = action.payload;
        state.error = null;
      })
      .addCase(getAgencyByCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.selectedAgency = null;
      });
  },
});

export const { clearAgencies } = agencySlice.actions;
export default agencySlice.reducer; 