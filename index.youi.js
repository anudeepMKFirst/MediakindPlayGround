/**
 * NAB Demo
 */

import React, { Component } from 'react';
import { AppRegistry, NativeModules } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Lander from './lander.youi.js';
import PDP from './pdp.youi.js';
import Video from './video.youi.js';  

const Cloud = NativeModules.Cloud;

Cloud.setRokuRegularFont("yi_Montserrat-Regular.otf");
Cloud.setRokuBoldFont("yi_Montserrat-Bold.otf");
import codePush from 'react-native-code-push';

const RootStack = createStackNavigator(
  {
    Home: Lander,
    Pdp: PDP,
    Video: Video,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    //disable the default transition
    transitionConfig : () => ({
      transitionSpec: {},
      screenInterpolator: () => {}
    }),
    //react-navigation has a default cardstyle thats white, so we need to
    //match our composition color to avoid a flash
    cardStyle: {
      backgroundColor: '#000',
    }
  }
);
 class YiReactApp extends Component {
  render() {
    return <RootStack/>;
  }
}

export default MyApp = codePush(YiReactApp);
AppRegistry.registerComponent('YiReactApp', () => MyApp);
