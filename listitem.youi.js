import {
  ButtonRef,
  ImageRef,
} from '@youi/react-native-youi';
import React, { Component, Fragment } from 'react';
import { NativeModules } from 'react-native';

const Cloud = NativeModules.Cloud;

export default class ListItem extends Component {
  render() {
    return (
      <Fragment>
        <ButtonRef testID={this.props.asset.id} name={this.props.name} onPress={() => this.props.onPress()}>
          <ImageRef name={this.props.image} 
            source={{ 
              uri: Cloud.isCloudServer ? "https://image.tmdb.org/t/p/w185" + this.props.asset.poster_path :
                           "https://image.tmdb.org/t/p/w342" + this.props.asset.poster_path}} 
          />
        </ButtonRef>
      </Fragment>
    );
  }
}
