import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedbackReducer from './slices/feedbackSlice';
import { RootState } from '../types';

const store = configureStore({
  reducer: {
    auth: authReducer,
    feedback: feedbackReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store; 