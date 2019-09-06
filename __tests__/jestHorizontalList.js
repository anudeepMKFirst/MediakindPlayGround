import React from 'react';
import HorizontalList from "./../horizontallist.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<HorizontalList/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});