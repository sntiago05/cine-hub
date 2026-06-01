// ============================================
// Router - Gestión de rutas
// ============================================

import { homePage } from '../pages/homePage';
import { LoginPage, initLoginForm } from '../pages/LoginPage';
import { RegisterPage, initRegisterForm } from '../pages/RegisterPage';
import { authLayout } from '../layouts/authLayout';
import { dashboardLayout } from '../layouts/dashboardLayout';
import { isAuthenticated } from '../utils/storage';

/**
 * Renderiza una página en el contenedor principal
 */
const renderPage = (content, layout = null) => {
  const app = document.getElementById('app');
  if (!app) return;

  if (layout) {
    app.innerHTML = layout(content);
  } else {
    app.innerHTML = content;
  }
};

/**
 * Maneja la navegación por rutas
 */
export const router = (path) => {
  // Limpiar el estado anterior
  const app = document.getElementById('app');
  if (app) app.innerHTML = '';

  // Rutas públicas (sin autenticación)
  if (path === '/login') {
    const content = LoginPage();
    renderPage(content, authLayout);
    initLoginForm();
    return;
  }

  if (path === '/register') {
    const content = RegisterPage();
    renderPage(content, authLayout);
    initRegisterForm();
    return;
  }

  // Rutas protegidas (requieren autenticación)
  if (isAuthenticated()) {
    if (path === '/' || path === '') {
      const content = homePage();
      renderPage(content, dashboardLayout);
      return;
    }
  } else {
    // Si no está autenticado, redirigir a login
    window.location.href = '/login';
    return;
  }

  // Ruta no encontrada - redirigir a login si no está autenticado
  if (!isAuthenticated()) {
    window.location.href = '/login';
  } else {
    window.location.href = '/';
  }
};

/**
 * Inicializa el sistema de rutas
 */
export const initRouter = () => {
  // Obtener la ruta actual de la URL
  const path = window.location.pathname;
  router(path);

  // Manejar cambios de historia (forward/back)
  window.addEventListener('popstate', () => {
    router(window.location.pathname);
  });
};
