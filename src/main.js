import { renderRoute } from './router/router';
import { initFeedback } from './components/feedback';

import './style.css'

document.addEventListener("DOMContentLoaded", () => {
  initFeedback();
  renderRoute();
});
window.addEventListener("popstate", renderRoute);
window.addEventListener("routechange", renderRoute);
