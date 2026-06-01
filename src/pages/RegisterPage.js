import { authLayout } from '../layouts/authLayout';
import { register } from '../services/auth.service';

export const RegisterPage = () => `
<div class="w-full max-w-md mx-auto">

  <div class="text-center mb-8">

    <h1 class="text-5xl font-black mb-3">
      CineHub
    </h1>

    <p class="text-slate-400">
      Crea tu cuenta
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

    <!-- Área de mensajes de error general -->
    <div id="register-error" class="text-red-500 text-sm text-center hidden"></div>

    <!-- Campo Nombre -->
    <div>
      <input
        id="register-name"
        type="text"
        placeholder="Nombre completo"
        class="
        w-full
        p-3
        rounded-xl
        bg-slate-800
        border border-slate-700
        focus:border-purple-500
        outline-none
        transition
        "
      />
      <span id="name-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <!-- Campo Email -->
    <div>
      <input
        id="register-email"
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
        transition
        "
      />
      <span id="email-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <!-- Campo Password -->
    <div>
      <input
        id="register-password"
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
        transition
        "
      />
      <span id="password-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <!-- Campo Confirmar Password -->
    <div>
      <input
        id="register-confirm"
        type="password"
        placeholder="Confirmar contraseña"
        class="
        w-full
        p-3
        rounded-xl
        bg-slate-800
        border border-slate-700
        focus:border-purple-500
        outline-none
        transition
        "
      />
      <span id="confirm-error" class="text-red-400 text-xs hidden"></span>
    </div>

    <!-- Botón Submit -->
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
      disabled:opacity-50
      disabled:cursor-not-allowed
      "
    >
      Registrarse
    </button>

    <!-- Link a Login -->
    <p class="text-center text-slate-400 text-sm">
      ¿Ya tienes cuenta?
      <a
        href="/login"
        class="text-purple-400 hover:text-purple-300 transition"
      >
        Inicia sesión
      </a>
    </p>

  </form>

</div>
`;

/**
 * Inicializa los event listeners del formulario de registro
 */
export const initRegisterForm = () => {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;

    // Obtener valores
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    // Limpiar errores previos
    document.getElementById('register-error').classList.add('hidden');
    document.getElementById('name-error').classList.add('hidden');
    document.getElementById('email-error').classList.add('hidden');
    document.getElementById('password-error').classList.add('hidden');
    document.getElementById('confirm-error').classList.add('hidden');

    // Intentar registro
    const result = await register(name, email, password, confirmPassword);

    if (result.success) {
      // Registro exitoso - redirigir
      window.location.href = '/';
    } else {
      // Mostrar errores
      if (result.errors) {
        if (result.errors.name) {
          document.getElementById('name-error').textContent = result.errors.name;
          document.getElementById('name-error').classList.remove('hidden');
        }
        if (result.errors.email) {
          document.getElementById('email-error').textContent = result.errors.email;
          document.getElementById('email-error').classList.remove('hidden');
        }
        if (result.errors.password) {
          document.getElementById('password-error').textContent = result.errors.password;
          document.getElementById('password-error').classList.remove('hidden');
        }
        if (result.errors.confirmPassword) {
          document.getElementById('confirm-error').textContent = result.errors.confirmPassword;
          document.getElementById('confirm-error').classList.remove('hidden');
        }
      } else if (result.error) {
        document.getElementById('register-error').textContent = result.error;
        document.getElementById('register-error').classList.remove('hidden');
      }
    }

    button.disabled = false;
  });
};
