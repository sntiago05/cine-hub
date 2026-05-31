export const registerPage = () => `
<div class="w-full max-w-md mx-auto">

  <div class="text-center mb-8">

    <h1 class="text-4xl font-black mb-3">
      Crear Cuenta
    </h1>

    <p class="text-slate-400">
      Únete a CineHub
    </p>

  </div>

  <form
  id="register-form"
  class="
  bg-slate-900
  border border-slate-800
  rounded-3xl
  p-8
  space-y-5
  shadow-xl
  "
  >

    <input
      placeholder="Nombre"
      class="
      w-full
      p-3
      rounded-xl
      bg-slate-800
      border border-slate-700
      focus:border-purple-500
      outline-none
      "
    />

    <input
      placeholder="Correo"
      class="
      w-full
      p-3
      rounded-xl
      bg-slate-800
      border border-slate-700
      focus:border-purple-500
      outline-none
      "
    />

    <input
      type="password"
      placeholder="Contraseña"
      class="
      w-full
      p-3
      rounded-xl
      bg-slate-800
      border border-slate-700
      focus:border-purple-500
      outline-none
      "
    />

    <button
      class="
      w-full
      bg-purple-600
      hover:bg-purple-700
      transition
      py-3
      rounded-xl
      font-semibold
      "
    >
      Crear Cuenta
    </button>

  </form>

</div>
`;