import {
  BackHandler,
  ButtonRef,
  Composition,
  FocusManager,
  ImageRef,
  StyleSheet,
  Text,
  TextRef,
  TouchableHighlight,
  View,
  ViewRef
} from '@youi/react-native-youi';
import React, { Component, Fragment } from 'react';
import Youtube from 'youtube-stream-url'

import ListItem from './listitem.youi.js';
import Timeline from './timeline.youi.js';

export default class PDP extends Component {

  constructor(props) {
    super(props);
    this.state = { visible: false, showModal: false };
  }

  onBackButtonPress = () => {
    this.state.showModal ? this.turnModalOff() : this.outTimeline.play().then(() => {this.props.navigation.goBack()});
    return true;
  }

  componentDidMount() {
    this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload => {

      BackHandler.addEventListener('onBackButtonPressed', this.onBackButtonPress);

      this.requestMovieDetailsAsync()
      .then((asset) => {
        this.setState({
          details: asset,
        });

        if (asset.videos.results.length > 0) {
          Youtube.getInfo({ url: 'https://www.youtube.com/watch?v=' + asset.videos.results[0].key })
            .then(video => { console.log(video); this.video = video });
        }

        FocusManager.setFocusRoot(this.root, true);
        FocusManager.focus(this.play);

        this.showMainIfNotVisible();
      })
    });

    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload => {
      this.setState({visible: false});
      BackHandler.removeEventListener('onBackButtonPressed', this.onBackButtonPress);
    });
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  requestMovieDetailsAsync = (callback) => {
    return fetch("https://api.themoviedb.org/3/movie/" + this.props.navigation.getParam('id', '299536') + "?api_key=7f5e61b6cef8643d2442344b45842192&append_to_response=releases,credits,recommendations,videos&language=en")
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  showMainIfNotVisible = () => {
    if (!this.state.visible) {
      this.inTimeline.play();
      this.setState({visible: true});
    }
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

  render() {
    let hasRecomendations = this.state.details && this.state.details.recommendations.results.length > 0;
    let recommendationsLength = hasRecomendations ? Math.min(Math.max(0, this.state.details.recommendations.results.length), 4) : 0;
    let recommendations = hasRecomendations ? Array(recommendationsLength).fill().map((_, i) =>
        <ListItem
          key={this.state.details.recommendations.results[i].id}
          name={'Poster' + (i + 1)}
          image='Image-2x3'
          asset={this.state.details.recommendations.results[i]}
          onPress={() => {
            FocusManager.setFocusRoot(this.root, false);
            this.outTimeline.play().then(() => {
              this.props.navigation.push('Pdp', { id: this.state.details.recommendations.results[i].id })
            });
          }}
        />
      ) : null;

    return (
      <Fragment>
        <Composition 
          source="PDP_Main"
          loadSync={true}
          onTimelinesLoaded={(timelines) => {this.showMainIfNotVisible}} 
          ref={(ref) => this.root = ref}
        >
          <Timeline name="Out" ref={(timeline) => this.outTimeline = timeline} />
          <Timeline name="In" ref={(timeline) => this.inTimeline = timeline}/>

          <ButtonRef
            name="Btn-Play"
            onPress={() => {
              this.outTimeline.play().then(() => {
                this.props.navigation.push('Video', { video: this.video })
              });
            }}
            ref={(ref) => this.play = ref } 
          />

          <Metadata asset={this.state.details} />

          <TextRef name="MoreLikeThis-NotFound" visible={!hasRecomendations}/>
          <ViewRef name="ListAnchor" visible={hasRecomendations}/>

          {recommendations}

        </Composition>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  modalContainerView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
  modalContainer: {
    position: "absolute",
    top: 300,
    bottom: 300,
    right: 300,
    left: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(55, 55, 55, 0.7)"
  },
  counterText: {
    color: 'red',
    fontSize: 120,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

function Metadata(props) {
  if (!props.asset)
    return null

  let releaseDate = props.asset.release_date.split("-")[0];
  let rating = props.asset.releases.countries.find((release) => release["iso_3166_1"] === "US");
  rating = rating && rating.certification ? "Rated " + rating.certification : null;
  let runtime = props.asset.runtime ? props.asset.runtime + " mins" : null;
  let details = [releaseDate, rating, runtime].filter((item) => item !== null).join(" | ");

  let director = props.asset.credits.crew.find((member) => member["job"] === "Director");
  director = director ? director.name : "";
  let stars = props.asset.credits.cast.slice(0, 3).map((member) => member["name"]).join(", ");

  let posterSource = "https://image.tmdb.org/t/p/w500" + props.asset.poster_path;
  let backdropSource = "https://image.tmdb.org/t/p/w1280" + props.asset.backdrop_path;

  return (
    <Fragment>
      <TextRef name="Title-Text" text={props.asset.title} />
      <TextRef name="Details-Text" text={details} />
      <TextRef name="Director" text={director} />
      <TextRef name="Stars" text={stars} />
      <TextRef name="Body-Text" text={props.asset.overview} />
      <ImageRef name="Image-2x3" source={{ uri: posterSource }} />
      <ImageRef name="Image-16x9" source={{ uri: backdropSource }} />
    </Fragment>
  );
}
