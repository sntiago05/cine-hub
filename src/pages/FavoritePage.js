import { getFavorites, removeFavorite } from "../services/favorites.service";
import { getSession } from "../utils/storage";
import { navigate } from "../utils/navigate";
import { ROUTES } from "../router/constants.routes";
import { confirmDialog, toast } from "../components/feedback";
import { escapeHtml } from "../utils/utils";

export const FavoritesPage = async () => {
  const user = getSession();

  try {
    const favorites = await getFavorites(user.id);

    if (!favorites.length) {
      return `
        <section class="py-16 text-center">
          <h1 class="text-3xl font-black">No tienes favoritos todavia</h1>
          <p class="mt-3 text-slate-400">Busca una serie y guardala para verla aqui.</p>
          <button id="search-empty-btn" class="mt-6 rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400">
            Buscar series
          </button>
        </section>
      `;
    }

    return `
      <section>
        <header class="mb-8">
          <h1 class="text-3xl font-black">Mis Favoritos</h1>
          <p class="mt-2 text-slate-400">Series guardadas en tu cuenta.</p>
        </header>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          ${favorites.map((favorite) => `
            <article class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
              <img
                src="${favorite.image || 'https://placehold.co/300x450'}"
                alt="${escapeHtml(favorite.showName)}"
                class="h-80 w-full object-cover"
              />
              <div class="p-4">
                <h3 class="min-h-12 text-lg font-bold">${escapeHtml(favorite.showName)}</h3>
                <div class="mt-4 flex gap-2">
                  <button data-show-id="${favorite.showId}" class="viewFavorite flex-1 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400">
                    Ver
                  </button>
                  <button data-id="${favorite.id}" class="removeFavorite rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500">
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  } catch {
    return `
      <section class="py-16 text-center">
        <h1 class="text-3xl font-black text-red-300">No se pudieron cargar tus favoritos</h1>
        <p class="mt-3 text-slate-400">Revisa que JSON Server este ejecutandose.</p>
      </section>
    `;
  }
};

export const initFavoritesPage = () => {
  document.getElementById("search-empty-btn")?.addEventListener("click", () => navigate(ROUTES.HOME));

  document.querySelectorAll(".viewFavorite").forEach((button) => {
    button.addEventListener("click", () => navigate(`${ROUTES.SHOW_DETAILS}/${button.dataset.showId}`));
  });

  document.querySelectorAll(".removeFavorite").forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmed = await confirmDialog({
        title: "Eliminar favorito",
        message: "Esta serie se quitara de tu lista de favoritos.",
        confirmText: "Eliminar",
        danger: true
      });
      if (!confirmed) return;

      try {
        button.disabled = true;
        await removeFavorite(button.dataset.id);
        toast("Favorite removed");
        navigate(ROUTES.FAVORITES, { replace: true });
      } catch {
        toast("Network error while deleting favorite", "error");
        button.disabled = false;
      }
    });
  });
};
