// import toast from 'react-hot-toast';
import { axios, setSession, authApi } from '../lib';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type IUser = {
  _id: string;
  fullName: string;
  schoolUser: string;
  roleId: string;
  mobile: string;
  email: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  imageUrl?: string;
  imgFullPath?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  isVerified?: boolean;
  permission: [
    {
      path: string;
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    },
  ];
  student: {
    _id: string;
    schoolUser: string;
    userId: string;
    rollNo: string;
    classId: string;
    sectionId: string;
    sessionId: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    dob: string; // ISO date string
    gender: string;
    fatherOccupation: string;
    motherOccupation: string;
    religion: string;
    studentEmail: string;
    mobile: string;
    address: string;
    aadhar: string;
    bloodGroup: string;
    session: string;
    imageUrl: string;
    status: number; // 1 = active, 0 = inactive (assumed)
    vehicleId: string;
  };
  faculty: {
    _id: string;
    facultyCode: string;
    facultyFullName: string;
    facultyEmail: string;
    facultyPhone: string;
    sessionId: string;
  };
};

export type ILoginResponse = {
  data: {
    message: string;
    token: string;
    success: boolean;
    userDetails: {};
  };
};

export type AuthStore = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  sessionId: string | null;
  user: IUser | null;
  setIsAuthenticated: (value: boolean) => void;
  setIsInitialized: (value: boolean) => void;
  setSessionId: (value: string | null) => void;
  login: (
    response: ILoginResponse,
  ) => Promise<ILoginResponse['data'] | undefined>;
  logout: () => void;
  initialize: () => Promise<void>;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isInitialized: false,
      sessionId: null,
      user: null,
      setIsAuthenticated: value => set({ isAuthenticated: value }),
      setIsInitialized: value => set({ isInitialized: value }),
      setSessionId: value => set({ sessionId: value }),
      initialize: async () => {
        try {
          const persistedSessionId = get().sessionId;
          const accessToken = await AsyncStorage.getItem('token');
          const firstSessionId = persistedSessionId
            ? `?sessionId=${persistedSessionId}`
            : '';
          if (accessToken) {
            setSession(accessToken);
            const response = await axios.get(
              `${authApi.getUser}${firstSessionId}`,
            );
            if (response?.data?.success) {
              const userDetails = response?.data?.userDetails;
              const currentSessionId =
                userDetails?.role === 'Faculty'
                  ? userDetails?.faculty?.sessionId
                  : userDetails?.student?.sessionId;

              set({
                isAuthenticated: true,
                isInitialized: true,
                user: userDetails,
                sessionId: persistedSessionId
                  ? persistedSessionId
                  : currentSessionId,
              });
            } else {
              set({ isAuthenticated: false, isInitialized: true, user: null });
              // toast.error('You are not authorized to access this page');
            }
          } else {
            set({ isAuthenticated: false, isInitialized: true, user: null });
          }
        } catch (error) {
          set({ isAuthenticated: false, isInitialized: true, user: null });
        }
      },
      login: async response => {
        try {
          const result = response?.data;
          setSession(result?.token);
          const userDetails = result?.userDetails as IUser;

          const sessionId =
            userDetails?.role === 'Faculty'
              ? userDetails?.faculty?.sessionId
              : userDetails?.student?.sessionId;

          set({
            user: userDetails,
            sessionId: sessionId,
          });

          get().initialize();
          return result;
        } catch (error) {
          // toast.error('Login Failed');
        }
      },
      logout: async () => {
        setSession(null);
        set({ isAuthenticated: false, user: null });
        await AsyncStorage.removeItem('token');
        await AsyncStorage.clear();
        get().initialize();
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
      partialize: state => ({ sessionId: state.sessionId }),
    },
  ),
);
