import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// ----------------------------------------------------------------------

export type { AxiosRequestConfig, AxiosResponse };

// export const BASE_URI = 'http://localhost:3002';
// export const BASE_URI = 'http://192.168.235.208:3002';
export const BASE_URI = 'https://api.executehub.com';
// export const BASE_URI = 'https://stagingapi.o2nenterprises.com';

const axiosInstance = axios.create({
  baseURL: BASE_URI + '/api/v1',
});

axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    const SID = await AsyncStorage.getItem('SID');
    config.headers['x-school-id'] = SID || 'lms';
    // await AsyncStorage.removeItem('authenticated');
    if (token) {
      // set token to header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// intercept every response
axiosInstance.interceptors.response.use(
  async response => {
    if (
      response.data?.authenticated == false ||
      response.data?.isUser == false
    ) {
      delete axiosInstance.defaults.headers.common.Authorization;
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.setItem(
        'authenticated',
        response.data?.authenticated.toString(),
      );
      // window.location.href = '/auth/login';
      Alert.alert('Session Expired');
      // Note: In React Native, you'll need to handle navigation differently
      // Example: navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
    return response;
  },
  async error => {
    Promise.reject(error);
  },
);

export default axiosInstance;
