import {
  FocusManager,
  Image,
  StyleSheet,
  Text,
  View
} from '@youi/react-native-youi';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

const SettingsData = require('./settings.json');
export const SettingsOptions = { ABOUT: 'about', TOS: 'tos', PP: 'pp' };

export var currentActiveSettingsOption = SettingsOptions.ABOUT;

setActiveSettingsOption = (option, callback) => {
  currentActiveSettingsOption = option;
  callback();
}

export default class SettingsModal extends Component {

  render(){
  let optionSettingsData = SettingsData[currentActiveSettingsOption];

  return (
    <View testID="Settings Screen" style={styles.modalFullContainer}>
      <Image style={styles.modalFullContainer} source={{uri: 'res://drawable/default/bokeh_bg_large.png'}}/>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity
          testID="About Button"
          ref={(ref) => {
            this.aboutButton = ref;
            if (ref !== null) {
              if (currentActiveSettingsOption == SettingsOptions.ABOUT) FocusManager.focus(ref)
              FocusManager.setNextFocus(this.aboutButton, this.aboutButton, "up")
              FocusManager.setNextFocus(this.aboutButton, this.aboutButton, "left")
              FocusManager.setNextFocus(this.aboutButton, this.aboutButton, "right")
            }
          }}
          onPress={() => {setActiveSettingsOption(SettingsOptions.ABOUT, this.props.callback)}}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonText}>{SettingsData['about'].title}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="TOS Button"
          ref={(ref) => {
            this.tosButton = ref;
            if (ref !== null) {
              if (currentActiveSettingsOption == SettingsOptions.TOS) FocusManager.focus(ref)
              FocusManager.setNextFocus(this.tosButton, this.tosButton, "left")
              FocusManager.setNextFocus(this.tosButton, this.tosButton, "right")
            }
          }}
          onPress={() => {setActiveSettingsOption(SettingsOptions.TOS, this.props.callback)}}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonText}>{SettingsData['tos'].title}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="PP Button"
          ref={(ref) => {
            this.ppButton = ref;
            if (ref !== null) {
              if (currentActiveSettingsOption == SettingsOptions.PP) FocusManager.focus(ref)
              FocusManager.setNextFocus(this.ppButton, this.ppButton, "left")
              FocusManager.setNextFocus(this.ppButton, this.ppButton, "right")
              FocusManager.setNextFocus(this.ppButton, this.ppButton, "down")
              FocusManager.setNextFocus(this.aboutButton, this.tosButton, "forward")
              FocusManager.setNextFocus(this.tosButton, this.ppButton, "forward")
              FocusManager.setNextFocus(this.ppButton, this.aboutButton, "forward")
              FocusManager.setNextFocus(this.ppButton, this.tosButton, "reverse")
              FocusManager.setNextFocus(this.tosButton, this.aboutButton, "reverse")
              FocusManager.setNextFocus(this.aboutButton, this.ppButton, "reverse")
            }
          }}
          onPress={() => {setActiveSettingsOption(SettingsOptions.PP, this.props.callback)}}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonText}>{SettingsData['pp'].title}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentTitleStyle}>{optionSettingsData.title}</Text>
        <Text style={styles.contentTextStyle}>{optionSettingsData.content}</Text>
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  modalFullContainer: {
    position: "absolute",
    backgroundColor: '#202328',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    position: "absolute",
    top: 200,
    bottom: 200,
    left: 100,
    width: 400,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 40,
  },
  buttonStyle: {
    alignItems: 'center',
    width: 400,
    height: 72,
    padding: 20,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 32
  },
  contentContainer: {
    position: "absolute",
    top: 200,
    bottom: 200,
    left: 600,
    right: 200,
    justifyContent: 'flex-start',
  },
  contentTitleStyle: {
    color: 'white',
    textAlign: 'left',
    fontSize: 48,
    margin: 40,
  },
  contentTextStyle: {
    color: 'gray',
    textAlign: 'left',
    fontSize: 24,
    marginLeft: 40,
    marginRight: 40,
    height: 450,
  },
})
