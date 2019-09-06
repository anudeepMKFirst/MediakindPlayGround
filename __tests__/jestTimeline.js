import React from 'react';
import Timeline from "./../timeline.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Timeline/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});