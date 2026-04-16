import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
export type RootStackParamList = {
  Home: undefined;
  Details: { movieId: string };
  MovieList: undefined;
  Login: undefined;
  TabScreen: undefined;
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  MyVideoPlayer: undefined;
  VideoPlayer: undefined;
  NewVideoPlayer: undefined;
  SendOTPMobile: undefined;
  VerifyMobileOTP: undefined;
  RegisterMobile: undefined;
  webview: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootStackNavigationProps<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;
