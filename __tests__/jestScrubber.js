import React from 'react';
import Scrubber from "./../scrubber.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Scrubber/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});