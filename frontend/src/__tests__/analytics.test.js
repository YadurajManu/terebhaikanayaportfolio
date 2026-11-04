const fs = require('fs');
const path = require('path');
const vm = require('vm');

test('queues custom events and defers PostHog network work until load and idle', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(match => match[1]).find(code => code.includes('posthog.init'));
  const insert = jest.fn();
  let loaded, idle;
  const context = {
    document: {
      readyState: 'loading',
      createElement: () => ({}),
      getElementsByTagName: () => [{ parentNode: { insertBefore: insert } }],
    },
    addEventListener: (event, callback) => { if (event === 'load') loaded = callback; },
    requestIdleCallback: callback => { idle = callback; },
  };
  context.window = context;
  vm.runInNewContext(script, context);
  context.posthog.capture('queued-custom-event');
  expect(context.posthog[0][0]).toBe('capture');
  expect(context.posthog[0][1]).toBe('queued-custom-event');
  expect(context.posthog._i[0][1]).toMatchObject({ disable_surveys: true, disable_session_recording: true });
  expect(insert).not.toHaveBeenCalled();
  loaded();
  expect(insert).not.toHaveBeenCalled();
  idle();
  expect(insert).toHaveBeenCalledTimes(1);
  expect(insert.mock.calls[0][0].src).toBe('https://us-assets.i.posthog.com/static/array.js');
  expect(html).not.toContain('plausible.io');
});
