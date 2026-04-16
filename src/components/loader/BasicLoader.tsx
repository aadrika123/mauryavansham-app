import { ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';

const BasicLoader = () => {
  const theme = useTheme();
  return (
    <ActivityIndicator
      // size="large"
      color="#A22200"
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}
      // color={theme.colors.primary}
    />
  );
};

export default BasicLoader;
