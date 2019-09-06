import React from 'react';
import VideoPlayer from "./../video.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const vid = {title: "test"};
  global.navigation.getParam = jest.fn().mockImplementation(function (a) { return vid; });

  const tree = renderer
    .create(<VideoPlayer navigation={global.navigation}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});