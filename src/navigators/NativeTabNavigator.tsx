import { useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Home, User, Settings } from 'lucide-react-native';
import { routes } from './navigatorConfig';
import { RootStackParamList, RootStackScreenProps } from './navigateType';
import { useRef, useEffect, useState } from 'react';

const Tab = createBottomTabNavigator<RootStackParamList>();
const { width: screenWidth } = Dimensions.get('window');

type IBottomList = {
  name: string;
  title: string;
  IconComponent: React.ComponentType<{ size: number; color: string }>;
};

const bottomList: Array<IBottomList> = [
  {
    name: 'Home',
    title: 'Home',
    IconComponent: Home,
  },
  {
    name: 'Profile',
    title: 'Profile',
    IconComponent: User,
  },
  {
    name: 'Settings',
    title: 'Settings',
    IconComponent: Settings,
  },
];

// Custom Tab Bar Component
const CustomTabBar = (props: any) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const currentRoute =
    props.navigation.getState().routeNames[props.navigation.getState().index];

  const currentIndex = bottomList.findIndex(item => item.name === currentRoute);

  useEffect(() => {
    setActiveIndex(currentIndex);
    Animated.spring(animatedValue, {
      toValue: currentIndex,
      useNativeDriver: true,
      tension: 120,
      friction: 7,
    }).start();
  }, [currentIndex, animatedValue]);

  const tabWidth = screenWidth / bottomList.length;

  return (
    <View
      style={{
        height: Platform.OS === 'ios' ? 90 : 70,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        paddingTop: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 0.5,
        borderTopColor: '#e5e7eb',
      }}
    >
      {/* Top indicator line */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          height: 2,
          width: tabWidth * 0.6, // Make line shorter than tab width
          backgroundColor: '#FFC107',
          borderRadius: 1,
          left: tabWidth * 0.2, // Center the line
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: bottomList.map((_, i) => i),
                outputRange: bottomList.map((_, i) => i * tabWidth),
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      />

      {/* Tab items container */}
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          paddingTop: 8,
        }}
      >
        {bottomList.map((item, index) => (
          <TabItem
            key={item.name}
            item={item}
            index={index}
            isActive={currentRoute === item.name}
            tabWidth={tabWidth}
            onPress={
              item.name === 'MovieList'
                ? () =>
                    props.navigation.navigate('MovieList', {
                      movieType: 'popular',
                    })
                : () =>
                    props.navigation.navigate(
                      item.name as keyof RootStackParamList,
                    )
            }
          />
        ))}
      </View>
    </View>
  );
};

// Individual tab item component
const TabItem = ({
  item,
  index,
  isActive,
  tabWidth,
  onPress,
}: {
  item: IBottomList;
  index: number;
  isActive: boolean;
  tabWidth: number;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const IconComponent = item.IconComponent;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.05 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [isActive, scaleAnim]);

  return (
    <TouchableOpacity
      style={{
        width: tabWidth,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Icon */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <IconComponent
            size={24}
            color={isActive ? '#FFC107' : '#9ca3af'}
            // strokeWidth={isActive ? 2 : 1.5}
          />
        </View>

        {/* Label */}
        <Text
          style={{
            fontSize: 11,
            fontWeight: isActive ? '600' : '400',
            color: isActive ? '#FFC107' : '#9ca3af',
            textAlign: 'center',
            letterSpacing: 0.2,
            lineHeight: 14,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const BottomTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        popToTopOnBlur: true,
      }}
      backBehavior="history"
      tabBar={props => <CustomTabBar {...props} />}
    >
      {routes.map(
        route =>
          route.isVisibleTab && (
            <Tab.Screen
              key={route.id}
              name={route.name as keyof RootStackParamList}
              component={
                route.component as React.ComponentType<
                  RootStackScreenProps<keyof RootStackParamList>
                >
              }
            />
          ),
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
