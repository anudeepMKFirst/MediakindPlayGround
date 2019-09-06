import {
  BackHandler,
  ButtonRef,
  Composition,
  FocusManager,
  ListRef,
  StyleSheet,
  View
} from '@youi/react-native-youi';
import React, { Component, Fragment } from 'react';
import { findNodeHandle, NativeModules } from 'react-native';

import HorizontalList from './horizontallist.youi.js';
import ListItem from './listitem.youi.js';
import SettingsModal from './settings.youi.js';
import Timeline, { TimelineGroup } from './timeline.youi.js'

const Cloud = NativeModules.Cloud;

export default class Lander extends Component {

  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      data: [],
      numLists: 4,
      itemsPerList: 10,
      showModal: false,
    };
  }

  requestPopularMoviesAsync = (pageNum) => {
    return fetch("https://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192&language=en&page=" + String(pageNum))
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.results;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onPosterClicked = (pdpId, index) => {
    this.outTimeline.play().then(() => {
      Cloud.setInitialScrollIndex(findNodeHandle(this.mainList), index);
      this.props.navigation.push('Pdp', { id: pdpId })
    })
  }

  onBackButtonPress = () => {
    if (this.state.showModal) {
      this.turnModalOff();
      return true;
    }
    else if (Cloud.isCloudServer)
    {
      Cloud.terminateApplication();
      return true;
    }
    return false;
  }

  componentDidMount() {
    this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload => {
      BackHandler.addEventListener('onBackButtonPressed', this.onBackButtonPress);
      this.inTimeline.play();
    });

    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload => {
      BackHandler.removeEventListener('onBackButtonPressed', this.onBackButtonPress)
    });

    listData = Array.from({length: this.state.numLists}, (_, i) => i);

    numPages = Math.ceil(this.state.numLists * this.state.itemsPerList / 20);
    requests = Array.from({length: numPages}, (_, i) => this.requestPopularMoviesAsync(i + 1));

    Promise.all(requests)
    .then(results => 
      results.reduce((accumulator, curentValue) => 
      accumulator.concat(curentValue)))
      .then((results) => {
        this.setState({
          assets: results,
          data: listData
        });
      })
      .catch((error) => {
        console.error(error)
      });
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  renderItem = ({item, index}) => {
    let startIndex = index * this.state.itemsPerList;
    return (
      <HorizontalList 
        assets={this.state.assets.slice(startIndex, startIndex + this.state.itemsPerList)}
        onPosterClicked={this.onPosterClicked}
        firstList={index == 0}
        index={index}
      />
    )
  }

  turnModalOn = () => {
    this.setState({
      showModal: true
    })
  }
  turnModalOff = () => {
    this.setState({
      showModal: false
    })
  }

  populateSettingsContent = () => {
    this.setState({
      showModal: true
    });
  }

  render() {
    this.inTimeline = new TimelineGroup();
    this.outTimeline = new TimelineGroup();

    let conditionalModalRender = this.state.showModal ? <SettingsModal callback={this.populateSettingsContent} /> : null;

    return (
      <Fragment>
        <Composition source="Lander_Main">
          <Timeline name="In" ref={(timeline) => this.inTimeline.add(timeline)} />
          <Timeline name="Out" ref={(timeline) => this.outTimeline.add(timeline)} />
          <ListRef
            ref={(ref) => this.mainList=ref}
            name="List-Main"
            data={this.state.data}
            renderItem={this.renderItem}
            horizontal={false}
            initialNumToRender={Cloud.isCloudServer ? this.state.numLists : null}
            snapToAlignment={'start'}
            snapToInterval={130}
          >
          </ListRef>
          <ButtonRef name="Btn-Profile" onPress={this.turnModalOn} />
        </Composition>

        <View style={styles.modalFullContainer}>
          {conditionalModalRender}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  modalFullContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
})
