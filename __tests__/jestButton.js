import React from 'react';
import Button from "./../button.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Button name="temp"/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});