import {
  getFavorites,
  removeFavorite
} from "../services/favorites.service";

import { getSession } from "../utils/session";

export const FavoritesPage = async () => {
  const user = getSession();

  const favorites = await getFavorites(user.id);

  if (!favorites.length) {
    return `
      <section class="text-center py-16">
        <h2 class="text-3xl font-bold">
          No favorites yet
        </h2>

        <p class="text-slate-400 mt-2">
          Add a show to your favorites.
        </p>
      </section>
    `;
  }

  return `
    <section>

      <h1 class="text-3xl font-bold mb-8">
        My Favorites
      </h1>

      <div class="grid md:grid-cols-3 gap-6">

        ${favorites
          .map(
            (favorite) => `
            <article
              class="
              bg-slate-900
              border border-slate-800
              rounded-2xl
              overflow-hidden
              "
            >

              <img
                src="${favorite.image}"
                alt="${favorite.showName}"
                class="w-full h-80 object-cover"
              />

              <div class="p-4">

                <h3 class="font-bold">
                  ${favorite.showName}
                </h3>

                <button
                  data-id="${favorite.id}"
                  class="
                  removeFavorite
                  mt-4
                  bg-red-600
                  px-4
                  py-2
                  rounded-xl
                  "
                >
                  Remove
                </button>

              </div>

            </article>
          `
          )
          .join("")}

      </div>

    </section>
  `;
};

export const initializeFavoritesPage = () => {
  document
    .querySelectorAll(".removeFavorite")
    .forEach((button) => {
      button.addEventListener(
        "click",
        async () => {
          await removeFavorite(
            button.dataset.id
          );

          location.reload();
        }
      );
    });
};