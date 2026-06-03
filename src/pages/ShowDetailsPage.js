import { tvmazeService } from '../services/tvmaze.service';
import { addFavorite, getFavoriteByShow, removeFavorite } from '../services/favorites.service';
import { navigate } from '../utils/navigate';
import { getSession } from '../utils/storage';
import { ROUTES } from '../router/constants.routes';
import { confirmDialog, toast } from '../components/feedback';
import { escapeHtml, stripHtml } from '../utils/utils';

export const ShowDetailsPage = async ({ id }) => {
  try {
    const show = await tvmazeService.getShowById(id);
    const user = getSession();
    const existingFavorite = await getFavoriteByShow(user.id, Number(id));

    const genres = show.genres?.length > 0 ? show.genres.join(', ') : 'No especificados';
    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const summary = show.summary ? stripHtml(show.summary) : 'No hay descripcion disponible.';
    const image = show.image?.original || 'https://placehold.co/400x600';
    const mediumImage = show.image?.medium || image;

    return `
      <div class="w-full max-w-5xl mx-auto py-4 sm:py-8">
        <button
          id="back-btn"
          class="mb-6 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Volver
        </button>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div class="md:col-span-1">
            <img
              src="${image}"
              alt="${escapeHtml(show.name)}"
              class="w-full rounded-lg border border-slate-800 shadow-xl"
            />
          </div>

          <div class="md:col-span-2">
            <h1 class="mb-4 text-4xl font-black sm:text-5xl">
              ${escapeHtml(show.name)}
            </h1>

            <p class="mb-6 text-3xl font-bold text-yellow-300">
              ${rating}
            </p>

            <div class="mb-6">
              <h3 class="mb-2 text-sm font-semibold text-slate-400">GENEROS</h3>
              <p class="text-lg">${escapeHtml(genres)}</p>
            </div>

            <div class="mb-8">
              <h3 class="mb-3 text-sm font-semibold text-slate-400">RESUMEN</h3>
              <p class="text-base leading-relaxed text-slate-300">
                ${escapeHtml(summary)}
              </p>
            </div>

            <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <p class="mb-1 text-xs font-semibold text-slate-400">ESTADO</p>
                <p class="text-lg">${escapeHtml(show.status || 'Desconocido')}</p>
              </div>
              <div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <p class="mb-1 text-xs font-semibold text-slate-400">TIPO</p>
                <p class="text-lg">${escapeHtml(show.type || 'Desconocido')}</p>
              </div>
            </div>

            <button
              id="favorite-btn"
              data-show-id="${show.id}"
              data-show-name="${escapeHtml(show.name)}"
              data-show-image="${mediumImage}"
              data-favorite-id="${existingFavorite?.id ?? ""}"
              class="w-full rounded-lg px-6 py-3 text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${existingFavorite ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'}"
            >
              ${existingFavorite ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
            </button>
          </div>
        </div>
      </div>
    `;
  } catch {
    return `
      <div class="w-full max-w-5xl mx-auto py-8 text-center">
        <p class="mb-4 text-lg text-red-400">Error al cargar los detalles de la serie.</p>
        <button id="back-btn" class="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700">
          Volver
        </button>
      </div>
    `;
  }
};

export const initShowDetailsPage = () => {
  document.getElementById('back-btn')?.addEventListener('click', () => {
    navigate(ROUTES.HOME);
  });

  const favoriteBtn = document.getElementById('favorite-btn');
  if (!favoriteBtn) return;

  favoriteBtn.addEventListener('click', async () => {
    const user = getSession();
    const showId = Number(favoriteBtn.dataset.showId);
    const showName = favoriteBtn.dataset.showName;
    const image = favoriteBtn.dataset.showImage;
    const favoriteId = favoriteBtn.dataset.favoriteId;

    try {
      favoriteBtn.disabled = true;

      if (favoriteId) {
        const confirmed = await confirmDialog({
          title: "Eliminar favorito",
          message: "Esta serie se quitara de tu lista de favoritos.",
          confirmText: "Eliminar",
          danger: true
        });
        if (!confirmed) return;

        await removeFavorite(favoriteId);
        favoriteBtn.dataset.favoriteId = "";
        favoriteBtn.textContent = "Agregar a Favoritos";
        favoriteBtn.classList.remove("bg-red-600", "text-white", "hover:bg-red-500");
        favoriteBtn.classList.add("bg-cyan-500", "text-slate-950", "hover:bg-cyan-400");
        toast("Favorite removed");
        return;
      }

      const created = await addFavorite({ userId: user.id, showId, showName, image });
      favoriteBtn.dataset.favoriteId = created.id;
      favoriteBtn.textContent = "Eliminar de Favoritos";
      favoriteBtn.classList.remove("bg-cyan-500", "text-slate-950", "hover:bg-cyan-400");
      favoriteBtn.classList.add("bg-red-600", "text-white", "hover:bg-red-500");
      toast("Favorite added");
    } catch {
      toast("Network error while updating favorites", "error");
    } finally {
      favoriteBtn.disabled = false;
    }
  });
};
