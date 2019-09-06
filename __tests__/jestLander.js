import React from 'react';
import Lander from "./../lander.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Lander navigation={global.navigation}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});