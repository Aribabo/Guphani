import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { BackHandler, Alert, Linking} from 'react-native';



const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
    console.log(latitude, longitude);
    setIsLoading(false);
    
    if (status !== 'granted') {
      Alert.alert("위치 권한 동의가 거절되었습니다.", "설정에서 위치정보를 허용해주세요.", [{ text: '확인', onPress: () => BackHandler.exitApp() }]);
      return;
    }



    // WebView를 새로고침하는 로직 추가
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  } catch (error) {
    console.log(error);
    // Alert.alert("위치 권한 동의가 거절되었습니다.", "설정에서 위치정보를 허용해주세요.", [{ text: '확인', onPress: () => BackHandler.exitApp() }]);
  }
};
getLocation()

// 종료 창
function close() {
  Alert.alert("종료하시겠어요?", "확인을 누르면 종료합니다.", [
    {
      text: "취소",
      onPress: () => {},
      style: "cancel",
    },
    { text: "확인", onPress: () => BackHandler.exitApp() },
  ]);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.webview = React.createRef();
    this.state = {
      url: "",
      canGoBack: false,
    };
  }

  // 이벤트 등록
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  // 이벤트 해제
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  // 이벤트 동작
  handleBackButton = () => {
    if (this.state.canGoBack) {
      if (this.state.url === "https://www.guphani.com/html/index.html") {
        close();
      } else {
        this.webview.current.goBack();
      }
    } else {
      close();
    }
    return true;
  };

  render() {
    return (
      <WebView
        source={{ uri: "https://www.guphani.com/html/index.html" }}
        ref={this.webview}
        onNavigationStateChange={(navState) => {
          this.setState({ url: navState.url, canGoBack: navState.canGoBack });
        }}
        onShouldStartLoadWithRequest={(event) => {
          if (event.url.startsWith('tel:') || event.url.startsWith('sms:')) {
            Linking.openURL(event.url);
            return false;
          }
          return true;
        }}
        onMessage={(event) => {
          const message = event.nativeEvent.data;
          if (message.startsWith('tel:') || message.startsWith('sms:')) {
            Linking.openURL(message);
          }
        }}
      />
    );
  }
}