import React from 'react';
import { shallow } from 'enzyme';
import MediaBox from '../src/MediaBox';
import mocker from './helper/new-mocker';

describe('<MediaBox />', () => {
  let wrapper;
  const materialboxMock = jest.fn();
  const restore = mocker('Materialbox', materialboxMock);

  afterAll(() => {
    restore();
  });

  test('renders', () => {
    wrapper = shallow(
      <MediaBox
        className="more"
        src="image.jpg"
        caption="A demo media box1"
        width="650"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
