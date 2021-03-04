import { h } from 'preact';
import { shallow } from 'enzyme';
import NavBar from '../src/components/NavBar';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure

describe('Initial Test of the NavBar', () => {
  test('NavBar renders 4 nav items', () => {
    const context = shallow(<NavBar />);
    console.log(context.debug())

    expect(context.find('NavItem').length).toBe(3);
    expect(context.find('Invite').length).toBe(1);
  });
});
