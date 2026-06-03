import { login } from '../services/auth.service';
import { navigate } from '../utils/navigate';
import { ROUTES } from '../router/constants.routes';
import { setButtonLoading, toast } from '../components/feedback';

export const LoginPage = () => `
<div class="w-full max-w-md mx-auto">

  <div class="text-center mb-8">

    <h1 class="text-4xl sm:text-5xl font-black mb-3">
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
  rounded-lg
  p-5 sm:p-8
  space-y-5
  shadow-xl
  "
  >

    <!-- Área de mensajes de error general -->
    <div id="login-error" class="text-red-500 text-sm text-center hidden"></div>

    <!-- Campo Email -->
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
        focus:border-cyan-400
        focus:ring-2
        focus:ring-cyan-400/30
        outline-none
        transition
        "
      />
      <span id="email-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <!-- Campo Password -->
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
        focus:border-cyan-400
        focus:ring-2
        focus:ring-cyan-400/30
        outline-none
        transition
        "
      />
      <span id="password-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <!-- Botón Submit -->
    <button
      type="submit"
      class="
      w-full
      bg-cyan-500
      text-slate-950
      hover:bg-cyan-400
      transition
      py-3
      rounded-xl
      font-semibold
      disabled:opacity-50
      disabled:cursor-not-allowed
      "
    >
      Iniciar Sesión
    </button>

    <!-- Link a Registro -->
    <p class="text-center text-slate-400 text-sm">
      ¿No tienes cuenta?
      <a
        id="register-nav"
        class="text-cyan-300 hover:text-cyan-200 transition cursor-pointer"
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

    const button = form.querySelector('button[type="submit"]');
    const stopLoading = setButtonLoading(button, "Ingresando...");

    // Obtener valores
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Limpiar errores previos
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('email-error').classList.add('hidden');
    document.getElementById('password-error').classList.add('hidden');

    // Intentar login
    const result = await login(email, password);

    if (result.success) {
      toast("Login successful");
      navigate(result.user.role === "admin" ? ROUTES.ADMIN : ROUTES.HOME, { replace: true });
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
        toast(result.error, "error");
      }
    }

    stopLoading();
  });

  document.getElementById("register-nav").addEventListener("click",()=>{
    navigate(ROUTES.REGISTER)
  }) 
};
