import { initLoginForm, LoginPage } from './pages/LoginPage'
import { initRegisterForm, RegisterPage } from './pages/RegisterPage'

import './style.css'
// Inicializar la aplicación cuando el DOM esté listo
/* document.addEventListener('DOMContentLoaded', () => {
  initRouter();
}); */
// document.getElementById('app').innerHTML = LoginPage()
document.getElementById('app').innerHTML = RegisterPage()
initRegisterForm()
// initLoginForm()