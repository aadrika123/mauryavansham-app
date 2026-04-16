import { Suspense, lazy, ElementType } from 'react';
import { ActivityIndicator } from 'react-native';

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense
      fallback={
        <ActivityIndicator
          color="#A22200"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );

const Login = Loadable(lazy(() => import('../screens/auth/login')));
const SignUp = Loadable(lazy(() => import('../screens/auth/sign-up')));
const WenView = Loadable(lazy(() => import('../screens/webview')));

type RouteType = {
  id: number;
  name: string;
  component: ElementType;
  isVisibleTab?: boolean;
};

export const routes: RouteType[] = [];

export const authRoutes: RouteType[] = [
  {
    id: 1,
    name: 'Login',
    component: Login,
  },
  {
    id: 2,
    name: 'sing-up',
    component: SignUp,
  },
  {
    id: 2,
    name: 'webview',
    component: WenView,
    isVisibleTab: false,
  },
];
