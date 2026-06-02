import { initLoginForm, LoginPage } from './pages/LoginPage'
import { initRegisterForm, RegisterPage } from './pages/RegisterPage'
import { renderRoute } from './router/router';

import './style.css'

document.addEventListener("DOMContentLoaded", () => renderRoute());
window.addEventListener("popstate", renderRoute);
window.addEventListener("routechange", renderRoute);