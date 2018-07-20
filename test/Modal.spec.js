import React from 'react';
import { shallow, mount } from 'enzyme';
import Modal from '../src/Modal';
import mocker from './helper/new-mocker';

describe('<Modal />', () => {
  let wrapper;
  const open = jest.fn();
  const close = jest.fn();
  const modalMock = jest.fn(() => ({ open, close }));
  const restore = mocker('Modal', modalMock);

  afterAll(() => {
    modalMock.unmock();
    restore();
  });

  const trigger = <button>click</button>;
  const children = (
    <div>
      <h1>Hello</h1>
    </div>
  );
  const header = 'Modal header';
  const modalOptions = {
    dismissible: true,
    opacity: 0.4
  };

  let renderedWrapper;

  describe('renders a modal', () => {
    beforeEach(() => {
      wrapper = mount(
        <Modal trigger={trigger} modalOptions={modalOptions} header={header}>
          {children}
        </Modal>
      );

      renderedWrapper = document.body.lastElementChild.innerHTML;
    });

    afterEach(() => {
      modalMock.mockClear();
      document.body.removeChild(document.body.lastElementChild);
    });

    test('has children', () => {
      expect(renderedWrapper).toContain(header);
      expect(wrapper).toMatchSnapshot();
    });

    test('has a footer', () => {
      expect(renderedWrapper).toContain('modal-footer');
    });
  });

  describe('without a trigger', () => {
    beforeEach(() => {
      wrapper = mount(<Modal modalOptions={modalOptions}>{children}</Modal>);
    });

    afterEach(() => {
      modalMock.mockClear();
      document.body.removeChild(document.body.lastElementChild);
    });

    test('renders', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Modal).length).toEqual(1);
    });
  });

  describe('controlled modal with `open` prop', () => {
    let testModal;

    beforeEach(() => {
      testModal = shallow(
        <Modal modalOptions={{ one: 1 }} open>
          {children}
        </Modal>
      );
    });

    afterEach(() => {
      open.mockClear();
      close.mockClear();
      modalMock.mockClear();
      document.body.removeChild(document.body.lastElementChild);
    });

    test('mounts opened', () => {
      // once in mount and twice in #showModal
      expect(open).toHaveBeenCalledTimes(1);
      expect(wrapper).toMatchSnapshot();
    });

    test('open on prop change', () => {
      testModal.setProps({ open: true });
      expect(open).toHaveBeenCalledTimes(1);
      // no trigger is defined, modal should be configured in constructor
      expect(modalMock.mock.calls[0]).toEqual(expect.anything(), [{ one: 1 }]);
      // showModal initializes the modal again
      expect(modalMock.mock.calls[1]).toEqual(undefined, [{ one: 1 }]);
    });

    test('closes on prop change', () => {
      testModal.setProps({ open: false });
      expect(close).toHaveBeenCalledTimes(1);
      // no trigger is defined, modal should be configured in constructor
      expect(modalMock.mock.calls[0]).toEqual(expect.anything(), [{ one: 1 }]);
      // open prop is set, so showModal is called
      expect(modalMock.mock.calls[1]).toEqual(undefined, [{ one: 1 }]);
      expect(open).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
    });
  });

  describe('renders a trigger', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Modal trigger={trigger} modalOptions={modalOptions} header={header}>
          {children}
        </Modal>
      );
    });

    afterEach(() => {
      open.mockClear();
      modalMock.mockClear();
      document.body.removeChild(document.body.lastElementChild);
    });

    test('renders', () => {
      expect(wrapper.find('button').length).toEqual(1);
      expect(wrapper).toMatchSnapshot();
    });

    test('initializes with modalOptions', () => {
      wrapper.find('button').simulate('click');
      expect(modalMock).toHaveBeenCalledWith(undefined, modalOptions);
      expect(open).toHaveBeenCalledTimes(1);
    });
  });
});
