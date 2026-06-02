import { dashboardLayout } from '../layouts/dashboardLayout';
import { tvmazeService } from '../services/tvmaze.service';
import { navigate } from '../utils/navigate';

/**
 * ShowDetailsPage - Página de detalle de una serie
 * @param {string} id - ID de la serie
 * @returns {Promise<string>} HTML de la página
 */
export const ShowDetailsPage = async (id) => {
  try {
    const show = await tvmazeService.getShowById(id);

    const genres = show.genres?.length > 0 ? show.genres.join(', ') : 'No especificados';
    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const summary = show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No hay descripción disponible.';
    const image = show.image?.original || 'https://placehold.co/400x600';

    const html = `
      <div class="w-full max-w-5xl mx-auto px-4 py-8">
        
        <!-- Back Button -->
        <button
          id="back-btn"
          class="
            mb-6
            px-4
            py-2
            bg-slate-800
            hover:bg-slate-700
            transition
            rounded-xl
            text-sm
            font-medium
          "
        >
          ← Volver
        </button>

        <!-- Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Image -->
          <div class="md:col-span-1">
            <img
              src="${image}"
              alt="${show.name}"
              class="w-full rounded-2xl shadow-xl"
            />
          </div>

          <!-- Info -->
          <div class="md:col-span-2">
            
            <h1 class="text-5xl font-black mb-4">
              ${show.name}
            </h1>

            <!-- Rating -->
            <div class="mb-6">
              <p class="text-3xl text-yellow-400 font-bold">
                ⭐ ${rating}
              </p>
            </div>

            <!-- Genres -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-slate-400 mb-2">GÉNEROS</h3>
              <p class="text-lg">${genres}</p>
            </div>

            <!-- Summary -->
            <div class="mb-8">
              <h3 class="text-sm font-semibold text-slate-400 mb-3">RESUMEN</h3>
              <p class="text-base leading-relaxed text-slate-300">
                ${summary}
              </p>
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p class="text-xs font-semibold text-slate-400 mb-1">ESTADO</p>
                <p class="text-lg">${show.status || 'Desconocido'}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-400 mb-1">TIPO</p>
                <p class="text-lg">${show.type || 'Desconocido'}</p>
              </div>
            </div>

            <!-- Add to Favorites Button -->
            <button
              id="favorite-btn"
              data-show-id="${show.id}"
              data-show-name="${show.name}"
              class="
                w-full
                px-6
                py-3
                bg-purple-600
                hover:bg-purple-700
                transition
                rounded-xl
                font-semibold
                text-lg
              "
            >
              ❤️ Agregar a Favoritos
            </button>

          </div>

        </div>

      </div>
    `;

    return html;
  } catch (error) {
    console.error('Error loading show details:', error);
    return `
      <div class="w-full max-w-5xl mx-auto px-4 py-8 text-center">
        <p class="text-red-500 text-lg mb-4">Error al cargar los detalles de la serie.</p>
        <button
          id="back-btn"
          class="
            px-4
            py-2
            bg-slate-800
            hover:bg-slate-700
            transition
            rounded-xl
            text-sm
            font-medium
          "
        >
          ← Volver
        </button>
      </div>
    `;
  }
};

/**
 * Inicializa los event listeners de ShowDetailsPage
 * @param {string} id - ID de la serie
 */
export const initShowDetailsPage = (id) => {
  // Botón volver
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Botón agregar a favoritos
  const favoriteBtn = document.getElementById('favorite-btn');
  if (favoriteBtn) {
    const showId = parseInt(favoriteBtn.dataset.showId);
    const showName = favoriteBtn.dataset.showName;
    
    // Verificar si ya está en favoritos y actualizar estado visual
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some((fav) => fav.id === showId);
    
    if (isFavorite) {
      favoriteBtn.textContent = '❤️ Eliminar de Favoritos';
      favoriteBtn.classList.add('bg-red-600', 'hover:bg-red-700');
      favoriteBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
    }
    
    favoriteBtn.addEventListener('click', () => {
      // Obtener favoritos del localStorage
      const currentFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const isCurrentlyFavorite = currentFavorites.some((fav) => fav.id === showId);

      if (isCurrentlyFavorite) {
        // Remover de favoritos
        const filtered = currentFavorites.filter((fav) => fav.id !== showId);
        localStorage.setItem('favorites', JSON.stringify(filtered));
        favoriteBtn.textContent = '❤️ Agregar a Favoritos';
        favoriteBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        favoriteBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
      } else {
        // Agregar a favoritos
        currentFavorites.push({ id: showId, name: showName });
        localStorage.setItem('favorites', JSON.stringify(currentFavorites));
        favoriteBtn.textContent = '❤️ Eliminar de Favoritos';
        favoriteBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
        favoriteBtn.classList.add('bg-red-600', 'hover:bg-red-700');
      }
    });
  }
};
