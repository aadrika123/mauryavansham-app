import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  IconButton,
  Divider,
  useTheme,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import {
  FormProvider,
  InputText,
  LoadingButton,
} from '../../../components/forms';
import { useForm } from 'react-hook-form';
import { authApi, getErrorMessage } from '../../../lib';
import * as yup from 'yup';
import { useApi, usePostMutation } from '../../../hooks/useCustomQuery';
import { useStore } from '../../../store';
import { yupResolver } from '@hookform/resolvers/yup';

const { width, height } = Dimensions.get('window');

const schema = yup.object({
  isStudent: yup.string().required('Please select login type'),
  schoolUser: yup.string().when('isStudent', {
    is: 'Student',
    then: schema => schema.required('School User ID is required'),
    otherwise: schema => schema.optional(),
  }),
  // email: yup.string().when('isStudent', {
  //   is: 'Email',
  //   then: schema =>
  //     schema.email('Invalid email format').required('Email is required'),
  //   otherwise: schema => schema.optional(),
  // }),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  // captchaAnswer: yup.string().required('Captcha is required')
});

const LoginScreen = () => {
  const postLogin = usePostMutation({});
  const { login } = useStore();
  const methods = useForm({
    defaultValues: {
      isStudent: 'Student',
      schoolUser: '',
      // email: '',
      password: '',
      // captchaAnswer: ''
    },
    resolver: yupResolver(schema),
  });

  const loginType = methods.watch('isStudent');

  const getCaptchaText = useApi<{
    success: boolean;
    sessionId: string;
    text: string;
  }>({
    api: authApi?.getCaptcha,
    options: {
      enabled: true,
    },
  });

  const refreshCaptcha = () => {
    getCaptchaText.refetch();
    // methods.setValue('captchaAnswer', '');
  };

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    Alert.alert(JSON.stringify(data));
    try {
      const response = await postLogin.mutateAsync({
        api: authApi.login,
        data: {
          // ...(loginType == 'Student'
          //   ? { schoolUser: data?.schoolUser }
          //   : { email: data?.email }),
          schoolUser: data?.schoolUser,
          isStudent: data?.isStudent,
          password: data?.password,
          captchaSessionId: getCaptchaText?.data?.sessionId,
          captchaAnswer: getCaptchaText?.data?.text,
        },
      });
      if (response?.data?.success) {
        ToastAndroid.show('Login successful!', ToastAndroid.SHORT);
        await login(response);
      } else {
        ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        refreshCaptcha();
      }
    } catch (error) {
      ToastAndroid.show(getErrorMessage(error), ToastAndroid.SHORT);
      refreshCaptcha();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a855f7']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Surface style={styles.logoSurface} elevation={4}>
                <User size={40} color="#6366f1" />
              </Surface>
            </View>
            <Text variant="headlineLarge" style={styles.title}>
              Welcome Back
            </Text>
            {/* <Text variant="bodyLarge" style={styles.subtitle}>
              {isLogin
                ? 'Sign in to continue to your account'
                : 'Create your account to get started'}
            </Text> */}
          </View>

          <FormProvider methods={methods}>
            {/* Login Form */}
            <Surface style={styles.formContainer} elevation={8 as any}>
              <View style={styles.form}>
                {/* <Text variant="headlineSmall" style={styles.formTitle}>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </Text> */}

                {/* Email Input */}
                <View
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <InputText
                    name="schoolUser"
                    label="schoolUser"
                    // mode="outlined"
                  />
                </View>
                {/* <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={() => <Mail size={20} color="#6366f1" />}
                    />
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  theme={{
                    colors: {
                      primary: '#6366f1',
                      outline: '#e5e7eb',
                    },
                  }}
                /> */}

                {/* Password Input */}
                <View
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <InputText name="password" label="Password" />
                </View>

                {/* Forgot Password Link (only for login) */}
                {/* {isLogin && (
                  <View style={styles.forgotPasswordContainer}>
                    <Button
                      mode="text"
                      onPress={() => console.log('Forgot password')}
                      textColor="#6366f1"
                      compact
                    >
                      Forgot Password?
                    </Button>
                  </View>
                )} */}

                {/* Submit Button */}
                <Button
                  mode="contained"
                  onPress={methods.handleSubmit(onSubmit)}
                  loading={postLogin?.isPending}
                  // disabled={!email || !password || loading}
                  style={styles.submitButton}
                  contentStyle={styles.submitButtonContent}
                  buttonColor="#6366f1"
                  textColor="white"
                >
                  {postLogin?.isPending ? 'Please wait...' : 'Sign In'}
                </Button>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <Divider style={styles.divider} />
                  <Text variant="bodySmall" style={styles.dividerText}>
                    OR
                  </Text>
                  <Divider style={styles.divider} />
                </View>

                {/* Social Login Buttons */}
                <View style={styles.socialContainer}>
                  <IconButton
                    icon="google"
                    mode="outlined"
                    size={24}
                    style={styles.socialButton}
                    onPress={() => console.log('Google login')}
                  />
                  <IconButton
                    icon="facebook"
                    mode="outlined"
                    size={24}
                    style={styles.socialButton}
                    onPress={() => console.log('Facebook login')}
                  />
                  <IconButton
                    icon="apple"
                    mode="outlined"
                    size={24}
                    style={styles.socialButton}
                    onPress={() => console.log('Apple login')}
                  />
                </View>
              </View>
            </Surface>
          </FormProvider>
          {/* Switch Mode */}
          <View style={styles.switchContainer}>
            <Text variant="bodyMedium" style={styles.switchText}>
              {/* {isLogin ? "Don't have an account?" : 'Already have an account?'} */}
              Login
            </Text>
            {/* <Button
              mode="text"
              onPress={switchMode}
              textColor="white"
              labelStyle={styles.switchButtonLabel}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Button> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoSurface: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    borderRadius: 24,
    marginHorizontal: 8,
    backgroundColor: 'white',
  },
  form: {
    padding: 32,
  },
  formTitle: {
    textAlign: 'center',
    color: '#1f2937',
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6b7280',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  switchText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  switchButtonLabel: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;
