import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './axios';

export const isValidToken = (token: string) => {
  if (!token) {
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------

// ----------------------------------------------------------------------

export const setSession = async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
    // axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
  }
};
