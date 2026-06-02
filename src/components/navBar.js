import { navigate } from '../utils/navigate';
import { getSession, clearSession } from '../utils/storage';

export const navbar = () => `
<nav class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">

  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

    <button 
      id="logo-btn"
      class="text-2xl font-black tracking-wide hover:opacity-80 transition cursor-pointer"
    >
      <span class="text-purple-500">Cine</span>Hub
    </button>

    <div class="flex items-center gap-6 text-sm font-medium">

      <!-- Home Link -->
      <button 
        id="home-nav-btn"
        class="text-slate-300 hover:text-purple-400 transition"
      >
        Inicio
      </button>

      <!-- Favorites Link -->
      <button 
        id="favorites-nav-btn"
        class="text-slate-300 hover:text-purple-400 transition"
      >
        ❤️ Favoritos
      </button>

      <!-- Logout Button -->
      <button 
        id="logout-btn"
        class="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg"
      >
        Salir
      </button>

    </div>

  </div>

</nav>
`;

/**
 * Inicializa los eventos del navbar
 */
export const initNavbar = () => {
  // Logo - ir a home
  const logoBtn = document.getElementById('logo-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Home button
  const homeBtn = document.getElementById('home-nav-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Favorites button
  const favoritesBtn = document.getElementById('favorites-nav-btn');
  if (favoritesBtn) {
    favoritesBtn.addEventListener('click', () => {
      navigate('/favorites');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      navigate('/login');
    });
  }
};