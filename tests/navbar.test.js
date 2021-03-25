import { h } from 'preact';
import { shallow } from 'enzyme';
import 'jest-canvas-mock';

import NavBar from '../src/components/NavBar';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure

describe('Initial Test of the NavBar', () => {
  test('NavBar renders 4 nav items', () => {
    const context = shallow(<NavBar />);

    expect(context.find('NavItem').length).toBe(3);
    expect(context.find('Invite').length).toBe(1);
  });
});
