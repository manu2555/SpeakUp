import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedbackReducer from './slices/feedbackSlice';
import agencyReducer from './slices/agencySlice';
import { RootState } from '../types';

const store = configureStore({
  reducer: {
    auth: authReducer,
    feedback: feedbackReducer,
    agencies: agencyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store; 