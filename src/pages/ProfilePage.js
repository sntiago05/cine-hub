import { getSession, clearSession } from "../utils/storage";
import { navigate } from "../utils/navigate";
import { ROUTES } from "../router/constants.routes";
import { confirmDialog, toast } from "../components/feedback";
import { escapeHtml } from "../utils/utils";

export const ProfilePage = () => {
  const user = getSession();

  return `
    <section class="max-w-4xl mx-auto">

      <h1 class="text-3xl font-black mb-6">
        Mi Perfil
      </h1>

      <div
        class="
        bg-slate-900
        border border-slate-800
        rounded-lg
        p-6
        space-y-3
        "
      >
        <p><strong>Nombre:</strong> ${escapeHtml(user?.name ?? "")}</p>
        <p><strong>Email:</strong> ${escapeHtml(user?.email ?? "")}</p>
        <p><strong>Rol:</strong> ${escapeHtml(user?.role ?? "")}</p>

        <button
          id="logoutButton"
          class="
          mt-6
          px-4
          py-2
          bg-red-600
          rounded-lg
          font-semibold
          "
        >
          Cerrar sesion
        </button>
      </div>

    </section>
  `;
};

export const initProfilePage = () => {
  const logoutButton =
    document.querySelector("#logoutButton");

  if (!logoutButton) return;

  logoutButton.addEventListener("click", async () => {
    const confirmed = await confirmDialog({
      title: "Cerrar sesion",
      message: "Tu sesion actual se cerrara y volveras a la pantalla de ingreso.",
      confirmText: "Cerrar sesion",
      danger: true
    });
    if (!confirmed) return;
    clearSession();
    toast("Sesion cerrada correctamente");
    navigate(ROUTES.LOGIN);
  });
};
