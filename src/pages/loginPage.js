export const loginPage = () => `
<div class="w-full max-w-md mx-auto">

  <div class="text-center mb-8">

    <h1 class="text-5xl font-black mb-3">
      CineHub
    </h1>

    <p class="text-slate-400">
      Inicia sesión para continuar
    </p>

  </div>

  <form
  id="login-form"
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
      type="email"
      placeholder="Correo electrónico"
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
      Iniciar Sesión
    </button>

    <p class="text-center text-slate-400 text-sm">
      ¿No tienes cuenta?
      <a
        href="/register"
        class="text-purple-400 hover:text-purple-300"
      >
        Regístrate
      </a>
    </p>

  </form>

</div>
`;