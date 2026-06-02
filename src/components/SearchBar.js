/**
 * Componente SearchBar
 * @returns {string} HTML del buscador
 */
export const SearchBar = () => `
<div class="mb-8">
  <form id="search-form" class="flex gap-2">
    <input
      id="search-input"
      type="text"
      placeholder="Busca una serie..."
      class="
        flex-1
        px-4
        py-3
        rounded-xl
        bg-slate-800
        border border-slate-700
        focus:border-purple-500
        outline-none
        text-white
        placeholder-slate-400
      "
    />
    <button
      type="submit"
      class="
        px-6
        py-3
        bg-purple-600
        hover:bg-purple-700
        transition
        rounded-xl
        font-semibold
        whitespace-nowrap
      "
    >
      Buscar
    </button>
  </form>
</div>
`;

/**
 * Inicializa el comportamiento del SearchBar
 * @param {function} onSearch - Callback cuando se envía la búsqueda
 */
export const initSearchBar = (onSearch) => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      onSearch(query);
    }
  });
};
