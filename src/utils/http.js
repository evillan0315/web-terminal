// src/utils/http.js
import { getAuthToken } from './auth';

export const setAuthHeaders = (headers = {}) => {
  const token = getAuthToken();
  console.log(token, 'setAuthHeaders')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  headers['Content-Type'] = 'application/json';
  return headers;
};

