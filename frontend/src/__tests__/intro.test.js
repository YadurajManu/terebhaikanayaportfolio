import { shouldPlayIntro } from '../components/BootScreen';
test('intro respects reduced motion, previous visits, and unavailable storage', () => {
  window.matchMedia = () => ({ matches: false });
  sessionStorage.clear();
  expect(shouldPlayIntro()).toBe(true);
  sessionStorage.setItem('yr-booted', '1');
  expect(shouldPlayIntro()).toBe(false);
  sessionStorage.clear();
  window.matchMedia = () => ({ matches: true });
  expect(shouldPlayIntro()).toBe(false);
  window.matchMedia = () => ({ matches: false });
  const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('disabled'); });
  expect(shouldPlayIntro()).toBe(true);
  spy.mockRestore();
});

const React = require('react');
const { createRoot } = require('react-dom/client');
const { act } = React;
const BootScreen = require('../components/BootScreen').default;
test('intro completes once, saves the session, and cleans up on skip', async () => {
  jest.useFakeTimers();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.clear();
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  const done = jest.fn();
  await act(async () => root.render(<BootScreen onDone={done} />));
  await act(async () => window.dispatchEvent(new Event('click')));
  await act(async () => jest.runAllTimers());
  expect(done).toHaveBeenCalledTimes(1);
  expect(sessionStorage.getItem('yr-booted')).toBe('1');
  await act(async () => root.unmount());
  container.remove();
  jest.useRealTimers();
});
