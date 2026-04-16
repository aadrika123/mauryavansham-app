import {View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {
  RootStackNavigationProps,
  RootStackParamList,
} from '../../navigators/navigateType';

type IAppBar = {
  navigation: RootStackNavigationProps<keyof RootStackParamList>;
  children: React.ReactNode;
  title: string;
};

const AppBar = ({navigation, children, title}: IAppBar) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <Appbar.BackAction
          color={theme.colors.text}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          title={title}
          titleStyle={{
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: 'bold',
          }}
        />
        {/* <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>
      {children}
    </View>
  );
};

export default AppBar;
