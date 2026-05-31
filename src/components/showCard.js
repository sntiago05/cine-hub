export const showCard = () => `
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
"
>

  <img
    src="https://placehold.co/300x450"
    class="w-full h-80 object-cover"
  />

  <div class="p-4">

    <h3 class="font-bold text-lg mb-1">
      Nombre Serie
    </h3>

    <p class="text-sm text-yellow-400">
      ⭐ 8.9
    </p>

    <div class="flex gap-2 mt-4">

      <button
      class="
      flex-1
      bg-purple-600
      hover:bg-purple-700
      transition
      py-2
      rounded-xl
      font-medium
      "
      >
        Ver
      </button>

      <button
      class="
      px-4
      bg-slate-800
      hover:bg-slate-700
      transition
      rounded-xl
      "
      >
        ❤️
      </button>

    </div>

  </div>

</article>
`;