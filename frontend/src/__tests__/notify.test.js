import { connectToasts, toast } from '../lib/notify';

test('queues first notifications until the lazy host mounts, then delivers later notifications once', () => {
  const listener = jest.fn();
  window.addEventListener('portfolio:toast', listener);
  toast.success('first', { description: 'queued' });
  toast.error('second');
  const sink = { success: jest.fn(), error: jest.fn() };
  const disconnect = connectToasts(sink);
  expect(sink.success).toHaveBeenCalledWith('first', { description: 'queued' });
  expect(sink.error).toHaveBeenCalledWith('second', undefined);
  toast.success('third');
  expect(sink.success).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenCalledTimes(2);
  disconnect();
  window.removeEventListener('portfolio:toast', listener);
});
