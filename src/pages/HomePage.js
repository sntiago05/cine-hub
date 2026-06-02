import { dashboardLayout } from '../layouts/dashboardLayout';
import { SearchBar, initSearchBar } from '../components/SearchBar';
import { showCard } from '../components/showCard';
import { tvmazeService } from '../services/tvmaze.service';
import { navigate } from '../utils/navigate';

/**
 * Maneja la búsqueda de series
 */
const handleSearch = async (query) => {
  const resultsContainer = document.getElementById('results-container');
  const loadingSpinner = document.getElementById('loading-spinner');
  const emptyState = document.getElementById('empty-state');

  if (!resultsContainer || !loadingSpinner || !emptyState) return;

  try {
    // Mostrar loading
    resultsContainer.classList.add('hidden');
    emptyState.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    // Buscar series
    const shows = await tvmazeService.searchShows(query);

    // Ocultar loading
    loadingSpinner.classList.add('hidden');

    if (shows.length === 0) {
      // Mostrar estado vacío
      emptyState.classList.remove('hidden');
    } else {
      // Mostrar resultados
      resultsContainer.innerHTML = shows
        .map((show) => showCard(show))
        .join('');
      resultsContainer.classList.remove('hidden');
      attachCardListeners();
    }
  } catch (error) {
    loadingSpinner.classList.add('hidden');
    emptyState.classList.remove('hidden');
    console.error('Search error:', error);
  }
};

/**
 * Inicializa los event listeners de las tarjetas
 */
const attachCardListeners = () => {
  // Botones de ver
  document.querySelectorAll('.view-show-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const showId = btn.dataset.showId;
      navigate(`/show/${showId}`);
    });
  });

  // Botones de favorito
  document.querySelectorAll('.favorite-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const showId = btn.dataset.showId;
      const showName = btn.dataset.showName;

      // Obtener favoritos del localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const isFavorite = favorites.some((fav) => fav.id === parseInt(showId));

      if (isFavorite) {
        // Remover de favoritos
        const filtered = favorites.filter((fav) => fav.id !== parseInt(showId));
        localStorage.setItem('favorites', JSON.stringify(filtered));
        btn.classList.remove('opacity-100');
        btn.classList.add('opacity-50');
      } else {
        // Agregar a favoritos
        favorites.push({ id: parseInt(showId), name: showName });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        btn.classList.remove('opacity-50');
        btn.classList.add('opacity-100');
      }
    });
  });
};

/**
 * HomePage - Página principal con búsqueda de series
 * @returns {string} HTML de la página
 */
export const homePage = () => {
  const html = `
    <div class="w-full max-w-7xl mx-auto px-4 py-8">
      
      <div class="mb-12">
        <h1 class="text-5xl font-black mb-3">
          CineHub
        </h1>
        <p class="text-slate-400">
          Descubre tus series favoritas
        </p>
      </div>

      ${SearchBar()}

      <!-- Loading Spinner -->
      <div
        id="loading-spinner"
        class="hidden py-20"
      >
        <div class="flex justify-center items-center h-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>

      <!-- Results Grid -->
      <div
        id="results-container"
        class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      ></div>

      <!-- Empty State -->
      <div
        id="empty-state"
        class="hidden text-center py-20"
      >
        <p class="text-slate-400 text-lg">
          No se encontraron resultados. Intenta con otra búsqueda.
        </p>
      </div>

    </div>
  `;

  return html;
};

/**
 * Inicializa la HomePage - Conecta todos los eventos
 */
export const initHomePage = () => {
  initSearchBar(handleSearch);
};
