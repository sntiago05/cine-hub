export const HomePage = async () => {
  const response = await fetch(
    "https://api.tvmaze.com/shows"
  );

  const shows = await response.json();

  return `
    <section>

      <h1 class="text-4xl font-black mb-8">
        Popular Shows
      </h1>

      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

        ${shows
          .slice(0, 20)
          .map(
            (show) => `
              <article
                class="
                bg-slate-900
                border border-slate-800
                rounded-2xl
                overflow-hidden
                hover:border-purple-500
                transition
                "
              >

                <img
                  src="${show.image?.medium}"
                  alt="${show.name}"
                  class="w-full h-80 object-cover"
                />

                <div class="p-4">

                  <h3
                    class="
                    font-bold
                    text-lg
                    mb-2
                    "
                  >
                    ${show.name}
                  </h3>

                  <p class="text-yellow-400">
                    ⭐ ${show.rating.average || "N/A"}
                  </p>

                  <button
                    data-id="${show.id}"
                    data-name="${show.name}"
                    data-image="${show.image?.medium}"
                    class="
                    favoriteButton
                    mt-4
                    w-full
                    bg-purple-600
                    hover:bg-purple-700
                    py-2
                    rounded-xl
                    "
                  >
                    Add to Favorites
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