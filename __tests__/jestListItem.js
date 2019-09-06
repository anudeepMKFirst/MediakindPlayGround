import React from 'react';
import ListItem from "./../listitem.youi.js";
import renderer from 'react-test-renderer';

it('renders correctly', () => {
	const asset = {
		id: 1,
		name: "test"
	}

  const tree = renderer
    .create(<ListItem asset={asset}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});