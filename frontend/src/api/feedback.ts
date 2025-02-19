import axios from 'axios';
import { API_URL } from '../config';
import { ApiResponse } from '../types';

export const deleteFeedback = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/feedback/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete feedback',
    };
  }
}; 