// import React, { useEffect } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { routes, authRoutes } from './navigatorConfig';
// import { RootStackParamList, RootStackScreenProps } from './navigateType';
// import { useAuth } from '../store/useAuth';
// import BasicLoader from '../components/loader/BasicLoader';
// import BottomTabNavigator from './NativeTabNavigator';

// const RootStack = createNativeStackNavigator<RootStackParamList>();

// export default function NativeStackNavigator() {
//   const { isAuthenticated, isInitialized, initialize } = useAuth();

//   useEffect(() => {
//     if (!isInitialized) {
//       initialize();
//     }
//   }, []);

//   if (!isInitialized) {
//     return <BasicLoader />;
//   }

//   if (!isAuthenticated) {
//     return (
//       <RootStack.Navigator
//         initialRouteName="webview"
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         {authRoutes.map(route => (
//           <RootStack.Screen
//             key={route.id}
//             name={route.name as keyof RootStackParamList}
//             component={
//               route.component as React.ComponentType<
//                 RootStackScreenProps<keyof RootStackParamList>
//               >
//             }
//           />
//         ))}
//       </RootStack.Navigator>
//     );
//   }

//   return (
//     <RootStack.Navigator
//       initialRouteName={'TabScreen'}
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <RootStack.Screen name={'TabScreen'} component={BottomTabNavigator} />
//       {routes.map(
//         route =>
//           !route.isVisibleTab && (
//             <RootStack.Screen
//               // options={{
//               //   freezeOnBlur: true,
//               // }}
//               key={route.id}
//               name={route.name as keyof RootStackParamList}
//               component={
//                 route.component as React.ComponentType<
//                   RootStackScreenProps<keyof RootStackParamList>
//                 >
//               }
//             />
//           ),
//       )}
//     </RootStack.Navigator>
//   );
// }

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authRoutes } from './navigatorConfig';
import { RootStackParamList, RootStackScreenProps } from './navigateType';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function NativeStackNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="webview"
      screenOptions={{
        headerShown: false,
      }}
    >
      {authRoutes.map(route => (
        <RootStack.Screen
          key={route.id}
          name={route.name as keyof RootStackParamList}
          component={
            route.component as React.ComponentType<
              RootStackScreenProps<keyof RootStackParamList>
            >
          }
        />
      ))}
    </RootStack.Navigator>
  );
}
