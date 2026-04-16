import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import RNFetchBlob from 'react-native-blob-util';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Image,
  ScrollView,
  Linking,
  Text,
  Alert,
  Platform,
  Button,
  Share,
} from 'react-native';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import Geolocation from '@react-native-community/geolocation';
import { openSettings } from 'react-native-permissions';
import {
  requestBluetoothPermission,
  requestCameraPermission,
  requestLocationPermission,
} from '../../utils/permission';
import RNShare from 'react-native-share';

// Type definitions
interface GeolocationData {
  redirectUrl?: string;
  [key: string]: any;
}

interface RazorpayOptions {
  description?: string;
  image?: string;
  currency?: string;
  key: string;
  amount: number;
  name: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
}

interface CallbackData {
  api: string;
  apiPayload?: Record<string, any>;
  token?: string;
  redirectUrl: string;
  isParam?: boolean;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface ApiResponse {
  error?: boolean;
  data?: {
    transactionNo?: string;
    [key: string]: any;
  };
}

interface WebViewMessage {
  Key: string;
  keyData?: {
    url?: string;
    data?: string;
    target?: string;
    message?: string;
    mobile?: string;
    email?: string;
    file?: string;
    option?: RazorpayOptions;
    callbackData?: CallbackData;
    title?: string;
    imageUrl?: string;
    redirectUrl?: string;
    [key: string]: any;
  };
}

type RootStackParamList = {
  PermissionComp: undefined;
};

const ActivityIndicatorElement = () => {
  return (
    <View style={styles.activityIndicatorStyle}>
      <ActivityIndicator color="#A22200" size="large" />
    </View>
  );
};

export default function App() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [keyFromReact, setKeyFromReact] = useState<string>('');
  const [loading, setIsLoading] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [refreshing] = useState<boolean>(false);
  const [refresherEnabled, setEnableRefresher] = useState<boolean>(true);
  const webView = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [geolocationData, setGeolocationData] =
    useState<GeolocationData | null>(null);

  // handle scroll
  const handleScroll = (event: any): void => {
    const yOffset = Number(event.nativeEvent.contentOffset.y);
    if (yOffset === 0) {
      setEnableRefresher(true);
    } else {
      setEnableRefresher(false);
    }
  };

  const handleBack = useCallback((): boolean => {
    if (canGoBack && webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => {
      backHandler.remove();
    };
  }, [handleBack]);

  function onShouldStartLoadWithRequest(
    request: ShouldStartLoadRequest,
  ): boolean {
    if (
      !request.url ||
      request.url.startsWith('http') ||
      request.url.startsWith('/') ||
      request.url.startsWith('#') ||
      request.url.startsWith('javascript') ||
      request.url.startsWith('about:blank') ||
      request.url.startsWith('data:text/html') ||
      request.url.startsWith('data:text/css') ||
      request.url.startsWith('data:text/javascript') ||
      request.url.startsWith('data:text/json') ||
      request.url.startsWith('data:text/plain') ||
      request.url.startsWith('data:text/xml')
    ) {
      return true;
    }

    if (request.url.startsWith('blob')) {
      Alert.alert('Link cannot be opened.');
      return false;
    }

    if (
      request.url.startsWith('tel:') ||
      request.url.startsWith('mailto:') ||
      request.url.startsWith('maps:') ||
      request.url.startsWith('geo:') ||
      request.url.startsWith('sms:') ||
      request.url.startsWith('whatsapp:') ||
      request.url.startsWith('intent:') ||
      request.url.startsWith('print:') ||
      request.url.startsWith('print://') ||
      request.url.startsWith('camera:')
    ) {
      Linking.openURL(request.url).catch((er: Error) => {
        Alert.alert('Failed to open Link: ' + er.message);
      });
      return false;
    }
    return true;
  }

  const shareLink = async (url: string): Promise<void> => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const shareLinkWhatsapp = async (
    data: string,
    target: string,
  ): Promise<void> => {
    const urlWhatsapp = `whatsapp://send?text=${data}&phone=${target}`;
    Linking.openURL(urlWhatsapp).catch((err: Error) => {
      Alert.alert('Error', err.message);
    });
  };

  const shareLinkText = async (data: string, target: string): Promise<void> => {
    const urlText = `sms:${target}?body=${data}`;
    Linking.openURL(urlText).catch((err: Error) => {
      Alert.alert('Error', err.message);
    });
  };

  const shareLinkMail = async (data: string, target: string): Promise<void> => {
    const urlMail = `mailto:${target}?subject=Download App&body=${data}`;
    Linking.openURL(urlMail).catch((err: Error) => {
      Alert.alert('Error', err.message);
    });
  };

  const shareFileToWhatsapp = async (
    message: string,
    mobile: string,
    file: string,
  ): Promise<void> => {
    const urlWhatsapp = `whatsapp://send?text=${message}&phone=${mobile}&attachment=${file}`;
    Linking.openURL(urlWhatsapp).catch((err: Error) => {
      Alert.alert('Error', err.message);
    });
  };

  const shareFileToMail = async (
    message: string,
    email: string,
    file: string,
  ): Promise<void> => {
    const urlMail = `mailto:${email}?subject=Download App&body=${message}&attachment=${file}`;
    Linking.openURL(urlMail).catch((err: Error) => {
      Alert.alert('Error', err.message);
    });
  };

  const shareImageWithWhatsApp = async (
    title: string,
    message: string,
    imageUrl: string,
  ): Promise<void> => {
    try {
      const filename = `shared_image_${Date.now()}.jpg`;
      const dirs = RNFetchBlob.fs.dirs;
      const path =
        Platform.OS === 'ios'
          ? `${dirs.DocumentDir}/${filename}`
          : `${dirs.CacheDir}/${filename}`;

      const response = await RNFetchBlob.config({
        fileCache: true,
        path: path,
      }).fetch('GET', imageUrl);

      const localFilePath = response.path();

      let fileUrl = '';
      if (Platform.OS === 'android') {
        fileUrl = `file://${localFilePath}`;
      } else {
        fileUrl = localFilePath;
      }

      const shareOptions = {
        title: title ?? 'Share Image',
        message: message ?? 'Share',
        url: fileUrl,
        type: 'image/jpeg',
        social: RNShare.Social.WHATSAPP,
      };

      await RNShare.open(shareOptions);

      if (Platform.OS === 'ios') {
        setTimeout(() => {
          RNFetchBlob.fs.unlink(localFilePath);
        }, 1000);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleWebViewMessage = async (
    event: WebViewMessageEvent,
  ): Promise<void> => {
    const message: WebViewMessage = JSON.parse(event.nativeEvent.data);

    if (message?.Key === 'RELOAD') {
      webView.current?.reload();
    } else if (message?.Key === 'GEO_LOCATION') {
      setIsLoading(true);
      setKeyFromReact(message?.Key);
      Geolocation.getCurrentPosition(
        position => {
          setGeolocationData({
            ...message?.keyData,
            ...position,
          });
          setIsLoading(false);
        },
        error => {
          console.log('error', error);
          Alert.alert('Error', error?.message, [
            {
              text: 'OK',
            },
          ]);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else if (message?.Key === 'OPEN_CAMERA') {
      setIsLoading(true);
      setKeyFromReact(message?.Key);
      await requestCameraPermission();
      setIsLoading(false);
    } else if (message?.Key === 'OPEN_LOCATION') {
      setIsLoading(true);
      setKeyFromReact(message?.Key);
      await requestLocationPermission();
      setIsLoading(false);
    } else if (message?.Key === 'OPEN_BLUETOOTH') {
      setIsLoading(true);
      setKeyFromReact(message?.Key);
      await requestBluetoothPermission();
      setIsLoading(false);
    } else if (message?.Key === 'OPEN_SETTINGS') {
      setIsLoading(true);
      await openSettings();
      setIsLoading(false);
    } else if (message?.Key === 'PERMISSION_SCREEN') {
      navigation.navigate('PermissionComp');
    } else if (message?.Key === 'SHARE_LINK') {
      setIsLoading(true);
      shareLink(message?.keyData?.url || '');
      setIsLoading(false);
    } else if (message?.Key === 'SHARE_LINK_WHATSAPP') {
      setIsLoading(true);
      shareLinkWhatsapp(
        message?.keyData?.data || '',
        message?.keyData?.target || '',
      );
      setIsLoading(false);
    } else if (message?.Key === 'SHARE_LINK_TEXT') {
      setIsLoading(true);
      shareLinkText(
        message?.keyData?.data || '',
        message?.keyData?.target || '',
      );
      setIsLoading(false);
    } else if (message?.Key === 'SHARE_LINK_MAIL') {
      setIsLoading(true);
      shareLinkMail(
        message?.keyData?.data || '',
        message?.keyData?.target || '',
      );
      setIsLoading(false);
    } else if (message?.Key === 'SHARE_FILE_TO_WHATSAPP') {
      setIsLoading(true);
      shareFileToWhatsapp(
        message?.keyData?.message || '',
        message?.keyData?.mobile || '',
        message?.keyData?.file || '',
      );
      setIsLoading(false);
    } else if (message?.Key === 'SHARE_FILE_TO_MAIL') {
      setIsLoading(true);
      shareFileToMail(
        message?.keyData?.message || '',
        message?.keyData?.email || '',
        message?.keyData?.file || '',
      );
      setIsLoading(false);
    } else if (message?.Key === 'SHARE_LINK_IMAGE') {
      setIsLoading(true);
      shareImageWithWhatsApp(
        message?.keyData?.title || '',
        message?.keyData?.message || '',
        message?.keyData?.imageUrl || '',
      );
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <WebView
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          startInLoadingState={true}
          javaScriptCanOpenWindowsAutomatically={true}
          style={{ flex: 1 }}
          bounces={false}
          renderLoading={ActivityIndicatorElement}
          originWhitelist={['*']}
          source={{
            uri: 'https://mauryavansham.com',
          }}
          scalesPageToFit={true}
          geolocationEnabled={true}
          javaScriptEnabled={true}
          allowFileAccess={true}
          domStorageEnabled={true}
          allowFileAccessFromFileURLs={true}
          thirdPartyCookiesEnabled={true}
          // onLoadStart={() => setIsLoading(true)}
          // onLoadEnd={() => setIsLoading(false)}
          // onLoad={() => setIsLoading(false)}
          ref={webView}
          onNavigationStateChange={(navState: WebViewNavigation) => {
            setCurrentUrl(navState.url);
          }}
          onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
          sharedCookiesEnabled={true}
          allowUniversalAccessFromFileURLs={true}
          cacheEnabled
          onScroll={handleScroll}
          onMessage={handleWebViewMessage}
          onError={() => {
            webView.current?.goBack();
          }}
          showsVerticalScrollIndicator={false}
          setSupportMultipleWindows={true}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          renderError={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            >
              <Image
                source={require('../../assets/no-internet.png')}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: 'cover',
                }}
              />
              <Text style={{ color: 'black', fontWeight: '600', fontSize: 20 }}>
                Oops! Something went wrong.
              </Text>
              <Text style={{ color: 'black', marginBottom: 20 }}>
                Check your internet connection.
              </Text>
              <Button
                color={'#1939B7'}
                title="Reload"
                onPress={() => webView.current?.reload()}
              />
            </View>
          )}
        />
        {loading ? <ActivityIndicatorElement /> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicatorStyle: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  ScrollStyle: {
    backgroundColor: '#A22200',
    position: 'relative',
  },
});
