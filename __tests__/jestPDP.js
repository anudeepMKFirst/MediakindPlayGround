import React from 'react';
import PDP from "./../pdp.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<PDP navigation={global.navigation}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});