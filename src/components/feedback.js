let confirmResolver = null;

export const ensureFeedbackRoot = () => {
  if (!document.getElementById("toast-root")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="toast-root" class="fixed right-4 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"></div>'
    );
  }

  if (!document.getElementById("modal-root")) {
    document.body.insertAdjacentHTML("beforeend", '<div id="modal-root"></div>');
  }
};

export const toast = (message, type = "success") => {
  ensureFeedbackRoot();
  const root = document.getElementById("toast-root");
  const tone = type === "error"
    ? "border-red-500/40 bg-red-950 text-red-100"
    : "border-emerald-500/40 bg-emerald-950 text-emerald-100";
  const item = document.createElement("div");
  item.className = `rounded-lg border px-4 py-3 text-sm shadow-xl ${tone}`;
  item.setAttribute("role", "status");
  item.textContent = message;
  root.appendChild(item);
  window.setTimeout(() => item.remove(), 2200);
};

export const confirmDialog = ({ title, message, confirmText = "Confirmar", cancelText = "Cancelar", danger = false }) => {
  ensureFeedbackRoot();
  const root = document.getElementById("modal-root");
  const confirmClass = danger
    ? "bg-red-600 text-white hover:bg-red-500"
    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400";

  root.innerHTML = `
    <div class="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <section class="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
        <h2 id="confirm-title" class="text-lg font-bold">${title}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-300">${message}</p>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button data-confirm="cancel" class="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800">${cancelText}</button>
          <button data-confirm="ok" class="rounded-lg px-4 py-2 text-sm font-semibold ${confirmClass}">${confirmText}</button>
        </div>
      </section>
    </div>
  `;

  return new Promise((resolve) => {
    confirmResolver = resolve;
    root.querySelector('[data-confirm="cancel"]')?.focus();
  });
};

export const initFeedback = () => {
  ensureFeedbackRoot();
  document.getElementById("modal-root")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-confirm]")?.dataset.confirm;
    if (!action || !confirmResolver) return;
    const resolve = confirmResolver;
    confirmResolver = null;
    document.getElementById("modal-root").innerHTML = "";
    resolve(action === "ok");
  });
};

export const setButtonLoading = (button, loadingText = "Procesando...") => {
  if (!button) return () => {};
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = loadingText;
  return () => {
    button.disabled = false;
    button.textContent = originalText;
  };
};
