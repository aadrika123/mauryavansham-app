import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import NativeStackNavigator from './src/navigators/NativeStackNavigator';
import Orientation from 'react-native-orientation-locker';
import { enableScreens } from 'react-native-screens';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

enableScreens(true);

Orientation.lockToPortrait();

const DismissKeyboard = ({ children }: { children: React.ReactNode }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const queryClient = new QueryClient();
export default function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <Image
        source={require('./src/assets/launch_screen.png')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        }}
      />
    );
  }
  return (
    <PaperProvider>
      <DismissKeyboard>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar barStyle="light-content" backgroundColor="#A22200" />
              <NativeStackNavigator />
            </SafeAreaView>
          </NavigationContainer>
        </QueryClientProvider>
      </DismissKeyboard>
    </PaperProvider>
  );
}
