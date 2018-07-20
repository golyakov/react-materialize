import React from 'react';
import { shallow } from 'enzyme';
import Slider from '../src/Slider';
import mocker from './helper/new-mocker';

describe('<Slider />', () => {
  let wrapper;
  const sliderMock = jest.fn();
  const restore = mocker('Slider', sliderMock);

  afterAll(() => {
    restore();
  });

  test('should render a Slider', () => {
    wrapper = shallow(<Slider />);
    expect(wrapper).toMatchSnapshot();
  });
});
