import { useSyncExternalStore } from "react";

// The current series pick lives in the URL hash (e.g. #45-mm--g-handle), so it survives reloads and
// can be shared. pushState does not fire hashchange, so same-page picks also send this event.
const FOCUS_EVENT = "vawe:focus";

const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  window.addEventListener("popstate", cb);
  window.addEventListener(FOCUS_EVENT, cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener("popstate", cb);
    window.removeEventListener(FOCUS_EVENT, cb);
  };
};

export const useHash = () =>
  useSyncExternalStore(
    subscribe,
    () => window.location.hash.slice(1),
    () => "",
  );

/** Select a focus key on the current page (or clear it with null). */
export const setFocusHash = (key: string | null) => {
  window.history.pushState(null, "", key ? `#${key}` : window.location.pathname);
  window.dispatchEvent(new Event(FOCUS_EVENT));
};
