import React from 'react';
import SettingsModal from "./../settings.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<SettingsModal/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});