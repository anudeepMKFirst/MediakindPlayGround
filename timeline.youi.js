import {
  TimelineRef,
} from '@youi/react-native-youi';
import React, { Component } from 'react';

export default class Timeline extends Component {
  render() {
    return (
      <TimelineRef
        name={this.props.name}
        onCompositionDidLoad={(timeline) => { this.ref = timeline; if (this.props.onCompositionDidLoad) this.props.onCompositionDidLoad(timeline); }}
        onCompleted={() => { if (this.resolve) this.resolve("onCompleted"); }}
      />
    );
  }

  play = () => new Promise((resolve, reject) => { this.resolve = resolve; this.ref.play(); });
}

export class TimelineGroup {
  constructor() {
    this.timelines = [];
  }

  add = function(timeline) {
    if (!timeline)
    {
      return;
    }
    this.timelines.push(timeline);
  }

  play = () => {
    return Promise.all(this.timelines.map(t => t.play()));
  }
}
