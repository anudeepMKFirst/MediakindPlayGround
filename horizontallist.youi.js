import {
  BackHandler,
  ButtonRef,
  Composition,
  FocusManager,
  ImageRef,
  ListRef,
  ViewRef,
} from '@youi/react-native-youi';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { findNodeHandle, NativeModules } from 'react-native';

import ListItem from './listitem.youi.js';
import Timeline, { TimelineGroup } from './timeline.youi.js';

const Cloud = NativeModules.Cloud;

export default class HorizontalList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lastFocusedItem: -1
    };
  }

  onItemClicked = (itemId, index) => {
    this.props.onPosterClicked(itemId, this.props.index);
    Cloud.setInitialScrollIndex(findNodeHandle(this.list), index);
  }

  renderItem = ({item, index}) => {
    return (
      <Composition source="Lander_Poster-Container">
        <ButtonRef 
          testID={item.id}
          name="Poster" 
          onPress={() => this.onItemClicked(item.id, index)}
          onCompositionDidLoad = {(ref) => index == 0 && this.props.firstList ? FocusManager.focus(ref) : {} } >
          <ImageRef
            name={"Container-Image"} 
            source={{ uri: Cloud ? "https://image.tmdb.org/t/p/w342" + item.poster_path :
                                  "https://image.tmdb.org/t/p/w500" + item.poster_path
            }} />
        </ButtonRef>
      </Composition>
    )
  }

  render() {
    return (
      <Composition source="Lander_Horizontal-Container">
        <ListRef
          name="List-Horizontal"
          data={this.props.assets}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => this.props.assets[index]}
          horizontal={true}
          ref = {(ref) => {
            Cloud.isCloudServer ? this.list = ref : {}}
          }
          onCompositionDidLoad={() => {
            if (Cloud.isCloudServer)
            {
              FocusManager.enableFocus(this.list);
              FocusManager.setNextFocus(this.list, this.list, "right");
            }
          }}
        />
      </Composition>
    );
  }
}

HorizontalList.propTypes = {
  assets: PropTypes.array,
  onPosterClicked: PropTypes.func,
  firstList: PropTypes.bool,
  index: PropTypes.number
};
