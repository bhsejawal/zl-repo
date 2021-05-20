import { h } from 'preact';
import { shallow } from 'enzyme';
import 'jest-canvas-mock';

// See: https://github.com/preactjs/enzyme-adapter-preact-pure

describe('Tests placeholder', () => {
  test('placeholder', () => {
    const context = shallow(<div />);

    expect(context.find('div').length).toBe(1);
  });
});
