import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedbackReducer from './slices/feedbackSlice';
import agencyReducer from './slices/agencySlice';
import statsReducer from './slices/statsSlice';
import { RootState } from '../types';

const store = configureStore({
  reducer: {
    auth: authReducer,
    feedback: feedbackReducer,
    agencies: agencyReducer,
    stats: statsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store; 