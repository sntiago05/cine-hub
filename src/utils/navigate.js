export const navigate = (path, options = {}) => {
  if (options.replace) {
    history.replaceState({}, "", path);
  } else {
    history.pushState({}, "", path);
  }
  window.dispatchEvent(
    new Event("routechange")
  );
};
