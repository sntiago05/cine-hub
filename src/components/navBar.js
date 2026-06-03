import { navigate } from '../utils/navigate';
import { getSession, clearSession } from '../utils/storage';
import { confirmDialog, toast } from './feedback';
import { ROUTES } from '../router/constants.routes';

const link = (id, label, path) => `
  <button
    id="${id}"
    data-route="${path}"
    class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    ${label}
  </button>
`;

export const navbar = () => {
  const session = getSession();
  const isAdmin = session?.role === "admin";

  return `
<nav class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

  <div class="max-w-7xl mx-auto flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">

    <button
      id="logo-btn"
      class="w-fit text-2xl font-black tracking-wide transition hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      <span class="text-cyan-300">Cine</span>Hub
    </button>

    <div class="flex flex-wrap items-center gap-2">
      ${isAdmin
        ? `
          ${link("admin-home-nav-btn", "Dashboard", ROUTES.ADMIN)}
          ${link("admin-users-nav-btn", "Usuarios", ROUTES.ADMIN_USERS)}
          ${link("admin-news-nav-btn", "Noticias", ROUTES.ADMIN_NEWS)}
          ${link("admin-categories-nav-btn", "Categorias", ROUTES.ADMIN_CATEGORIES)}
        `
        : `
          ${link("home-nav-btn", "Inicio", ROUTES.HOME)}
          ${link("news-nav-btn", "Noticias", ROUTES.NEWS)}
          ${link("favorites-nav-btn", "Favoritos", ROUTES.FAVORITES)}
          ${link("profile-nav-btn", "Perfil", ROUTES.PROFILE)}
        `}

      <button
        id="logout-btn"
        class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Salir
      </button>

    </div>

  </div>

</nav>
`;
};

/**
 * Inicializa los eventos del navbar
 */
export const initNavbar = () => {
  const logoBtn = document.getElementById('logo-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', () => {
      const session = getSession();
      navigate(session?.role === "admin" ? ROUTES.ADMIN : ROUTES.HOME);
    });
  }

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.route));
  });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const confirmed = await confirmDialog({
        title: "Cerrar sesion",
        message: "Tu sesion actual se cerrara y volveras a la pantalla de ingreso.",
        confirmText: "Cerrar sesion",
        danger: true
      });
      if (!confirmed) return;
      clearSession();
      toast("Sesion cerrada correctamente");
      navigate(ROUTES.LOGIN);
    });
  }
};
