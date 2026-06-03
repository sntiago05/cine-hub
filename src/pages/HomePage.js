import { SearchBar, initSearchBar } from '../components/SearchBar';
import { showCard } from '../components/showCard';
import { Loader } from '../components/Loader';
import { newsCard } from '../components/newsCard';
import { tvmazeService } from '../services/tvmaze.service';
import { fetchAllNewsWithCategories } from '../services/news.service';
import { addFavorite, getFavoriteByShow, removeFavorite } from '../services/favorites.service';
import { navigate } from '../utils/navigate';
import { getSession } from '../utils/storage';
import { ROUTES } from '../router/constants.routes';
import { toast } from '../components/feedback';

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
      navigate(`${ROUTES.SHOW_DETAILS}/${showId}`);
    });
  });

  // Botones de favorito
  document.querySelectorAll('.favorite-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const user = getSession();
      const showId = Number(btn.dataset.showId);
      const showName = btn.dataset.showName;
      const image = btn.dataset.showImage || 'https://placehold.co/300x450';

      try {
        btn.disabled = true;
        const existing = await getFavoriteByShow(user.id, showId);
        if (existing) {
          await removeFavorite(existing.id);
          toast("Favorite removed");
        } else {
          await addFavorite({ userId: user.id, showId, showName, image });
          toast("Favorite added");
        }
      } catch {
        toast("Network error while updating favorites", "error");
      } finally {
        btn.disabled = false;
      }
    });
  });
};

const loadLatestNews = async () => {
  const loading = document.getElementById("latest-news-loading");
  const grid = document.getElementById("latest-news-grid");
  const empty = document.getElementById("latest-news-empty");
  if (!loading || !grid || !empty) return;

  try {
    const articles = await fetchAllNewsWithCategories();
    const latest = articles
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 3);

    if (latest.length === 0) {
      empty.classList.remove("hidden");
      return;
    }

    grid.innerHTML = latest.map(newsCard).join("");
    grid.classList.remove("hidden");
  } catch {
    empty.textContent = "No news available at the moment.";
    empty.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
};

const attachLatestNewsListeners = () => {
  document.getElementById("latest-news-section")?.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");
    if (!routeButton) return;
    navigate(routeButton.dataset.route);
  });
};

/**
 * HomePage - Página principal con búsqueda de series
 * @returns {string} HTML de la página
 */
export const homePage = () => {
  const html = `
    <div class="w-full max-w-7xl mx-auto px-4 py-8">
      
      <div class="mb-10">
        <h1 class="text-4xl sm:text-5xl font-black mb-3">
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

      <section id="latest-news-section" class="mt-14">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-black">Latest News</h2>
            <p class="mt-1 text-slate-400">Updates and highlights curated by CineHub.</p>
          </div>
          <button
            data-route="${ROUTES.NEWS}"
            class="w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            View all
          </button>
        </div>

        <div id="latest-news-loading">
          ${Loader("Loading latest news...")}
        </div>
        <p id="latest-news-empty" class="hidden rounded-lg border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
          No news available at the moment.
        </p>
        <div id="latest-news-grid" class="hidden grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"></div>
      </section>

    </div>
  `;

  return html;
};

/**
 * Inicializa la HomePage - Conecta todos los eventos
 */
export const initHomePage = () => {
  initSearchBar(handleSearch);
  attachLatestNewsListeners();
  loadLatestNews();
};
