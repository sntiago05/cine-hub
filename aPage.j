import { authLayout } from "../layouts/authLayout";
import { authService } from "../services/services";

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

    <!-- Área de mensajes de error -->
    <div id="login-error" class="text-red-500 text-sm text-center hidden"></div>

    <div>
      <input
        id="login-email"
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
      <span id="email-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <div>
      <input
        id="login-password"
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
      <span id="password-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <button
      type="submit"
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

/**
 * Inicializa los event listeners del formulario de login
 */
export const initLoginForm = () => {
  const form = document.getElementById('login-form');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Limpiar errores previos
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('email-error').classList.add('hidden');
    document.getElementById('password-error').classList.add('hidden');

    // Intentar login
    const result = await authService.login(email, password);

    if (result.success) {
      // Login exitoso - redirigir a inicio
      window.location.href = '/';
    } else {
      // Mostrar errores
      if (result.errors) {
        if (result.errors.email) {
          document.getElementById('email-error').textContent = result.errors.email;
          document.getElementById('email-error').classList.remove('hidden');
        }
        if (result.errors.password) {
          document.getElementById('password-error').textContent = result.errors.password;
          document.getElementById('password-error').classList.remove('hidden');
        }
      } else if (result.error) {
        document.getElementById('login-error').textContent = result.error;
        document.getElementById('login-error').classList.remove('hidden');
      }
    }
  });
};
