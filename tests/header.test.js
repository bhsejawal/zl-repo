import { h } from 'preact';
import { shallow } from 'enzyme';
import Header from '../src/components/header';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure

describe('Initial Test of the Header', () => {
  test('Header renders 3 nav items', () => {
    const context = shallow(<Header />);
    expect(context.find('h1').text()).toBe('Zoolife');
    expect(context.find('Link').length).toBe(1);
  });
});
