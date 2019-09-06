import {
  BackHandler,
  Composition,
  VideoRef
} from '@youi/react-native-youi';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const NativeModules = require('NativeModules');
const platform = NativeModules.PlatformConstants ? NativeModules.PlatformConstants.platform : 'unknown';
const Cloud = NativeModules.Cloud;

export default class VideoPlayer extends Component {

  constructor(props) {
    super(props);
    // default video to play if none available for the asset
    var videoSource = {
      uri: "http://link.theplatform.com/s/BpkrRC/ckSTzzdGO_K3",
      type: "HLS"
    }

    this.state = {
      videoSource: videoSource,
      formattedTime: "00:00",
      metadata: {}
    };

    let video = this.props.navigation.getParam('video')
    if (video && video.formats) {
      let format = video.formats.find(format => {
        let indexStart = format.type.indexOf('codecs="');
        // move indexStart from beginning of codecs to the first "
        indexStart = format.type.indexOf('"', indexStart + 1);
        // second "
        const indexEnd = format.type.indexOf('"', indexStart + 1);
        const codecs = format.type.substring(indexStart, indexEnd);
        console.log(codecs);
        // https://cconcolato.github.io/media-mime-support/
        // explains avc1.4 usage here.
        return codecs.split(',')[0].includes("avc1.4")
      })

      if (platform !== 'ps4') {
        // We use the default video stream on PS4 as the castlabs player has trouble with the youtube / google video URL
        videoSource = { uri: format.url, type: 'MP4' }
      }
      if (format) {
        this.state = {
          videoSource: videoSource,
          formattedTime: "00:00",
          metadata: {title: video.title, id: video.video_id, BookmarkInterval:3, PlayStart:this.getPlayStartTime(video.video_id)},
        };
      }
    }
  }

  getPlayStartTime(videoId) {
    let bookmark = Cloud ? Cloud.lastPlaybackSessionInfo.bookmark : null;
    let startTime = 0;

    if (bookmark && bookmark.assetid === videoId) {
      if (bookmark.durationInMilliSeconds - bookmark.currentTimeInMilliSeconds >= 30000) {
        startTime = bookmark.currentTimeInMilliSeconds / 1000;
      }
    }
    return startTime;
  }

  onBackButtonPress = () => {
    this.video.stop();
    this.props.navigation.goBack();
    return true;
  }

  componentDidMount() {
    this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('onBackButtonPressed', this.onBackButtonPress)
    );

    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('onBackButtonPressed', this.onBackButtonPress)
    );
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
      <Composition source="Player_VideoRef">
        <VideoRef
          name="Video-Surface-View"
          testID="VideoSurface"
          style={styles.video}
          ref={(ref) => { this.video = ref; }}
          source={this.state.videoSource}
          metadata={this.state.metadata}
          onReady={() => this.video.play() }
          onPlaybackComplete={this.onBackButtonPress}
          onCurrentTimeUpdated={(currentTime) => {
            var s = Math.floor(currentTime / 1000);
            var m = Math.floor(s / 60);
            var h = Math.floor(s / 3600);
            h = h < 1 ? '' : h + ':';
            m = m < 10 ? '0' + m : m;
            s = s % 60;
            s = s < 10 ? '0' + s : s;

            var time = h + m + ':' + s;
            this.setState({
              currentTime: currentTime,
              formattedTime: time
            });
            console.log("currentTime: " + time);
          }}
          onDurationChanged={(duration) => {
            this.setState({
              duration: duration
            });
            console.log("duration (ms) changed: " + duration);
          }}
        />
        </Composition>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: 1920,
    height: 1080
  },
});
