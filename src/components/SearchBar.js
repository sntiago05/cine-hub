/**
 * Componente SearchBar
 * @returns {string} HTML del buscador
 */
export const SearchBar = () => `
<div class="mb-8">
  <form id="search-form" class="flex flex-col gap-2 sm:flex-row">
    <input
      id="search-input"
      type="text"
      placeholder="Busca una serie..."
      class="
        flex-1
        px-4
        py-3
        rounded-lg
        bg-slate-800
        border border-slate-700
        focus:border-cyan-400
        focus:ring-2
        focus:ring-cyan-400/30
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
        bg-cyan-500
        text-slate-950
        hover:bg-cyan-400
        transition
        rounded-lg
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
