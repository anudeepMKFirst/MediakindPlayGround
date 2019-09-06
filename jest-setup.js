import mocks from 'react-native-jest-mocks';
mocks.initAll();

global.navigation = { 
	addListener: jest.fn()
};

global.fetch = require('jest-fetch-mock');

