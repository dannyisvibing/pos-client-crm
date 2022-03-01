import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

// Note: Keep in mind that if you decide to "eject" before creating src/setupTests.js, the resulting package.json file won't contain any reference to it.
// Read here to learn how to add this after ejecting.
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#initializing-test-environment
configure({ adapter: new Adapter() });
