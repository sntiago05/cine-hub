import { getSession } from "../utils/session";

export const ProfilePage = () => {
  const user = getSession();

  return `
    <section class="max-w-4xl mx-auto p-6">

      <h1 class="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div
        class="
        bg-slate-900
        border border-slate-800
        rounded-2xl
        p-6
        "
      >
        <p><strong>Name:</strong> ${user?.name ?? ""}</p>
        <p><strong>Email:</strong> ${user?.email ?? ""}</p>
        <p><strong>Role:</strong> ${user?.role ?? ""}</p>

        <button
          id="logoutButton"
          class="
          mt-6
          px-4
          py-2
          bg-red-600
          rounded-xl
          "
        >
          Logout
        </button>
      </div>

    </section>
  `;
};

export const initializeProfilePage = () => {
  const logoutButton =
    document.querySelector("#logoutButton");

  if (!logoutButton) return;

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("session");
    location.reload();
  });
};