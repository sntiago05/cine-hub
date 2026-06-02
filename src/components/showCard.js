/**
 * Componente ShowCard
 * @param {Object} show - Objeto de la serie con propiedades: id, image, name, rating
 * @returns {string} HTML de la tarjeta de serie
 */
export const showCard = (show) => {
  // Verificar si está en favoritos
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.some((fav) => fav.id === show.id);
  
  return `
<article
class="
bg-slate-900
rounded-2xl
overflow-hidden
border border-slate-800
hover:border-purple-500
hover:-translate-y-1
transition-all
duration-300
shadow-lg
cursor-pointer
"
>

  <img
    src="${show.image?.medium || 'https://placehold.co/300x450'}"
    alt="${show.name}"
    class="w-full h-80 object-cover"
  />

  <div class="p-4">

    <h3 class="font-bold text-lg mb-1 line-clamp-2">
      ${show.name}
    </h3>

    <p class="text-sm text-yellow-400">
      ⭐ ${show.rating?.average ? show.rating.average.toFixed(1) : 'N/A'}
    </p>

    <div class="flex gap-2 mt-4">

      <button
        data-show-id="${show.id}"
        class="
        view-show-btn
        flex-1
        bg-purple-600
        hover:bg-purple-700
        transition
        py-2
        rounded-xl
        font-medium
        text-white
        "
      >
        Ver
      </button>

      <button
        data-show-id="${show.id}"
        data-show-name="${show.name}"
        class="
        favorite-btn
        px-4
        transition
        rounded-xl
        font-medium
        ${isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-700'}
        "
      >
        ❤️
      </button>

    </div>

  </div>

</article>
`;
};