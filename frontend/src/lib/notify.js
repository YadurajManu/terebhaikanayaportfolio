const pending = [];
let deliver;

function notify(kind, message, options) {
  if (deliver) return deliver[kind](message, options);
  pending.push({ kind, message, options });
  window.dispatchEvent(new Event("portfolio:toast"));
}

// Keep the first notification until the lazy Toaster has subscribed.
export function connectToasts(toast) {
  deliver = toast;
  pending.splice(0).forEach(({ kind, message, options }) => toast[kind](message, options));
  return () => { deliver = undefined; };
}

export const toast = {
  success: (message, options) => notify("success", message, options),
  error: (message, options) => notify("error", message, options),
};
