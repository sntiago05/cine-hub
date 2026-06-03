import { navbar, initNavbar } from "../components/navBar";

export const dashboardLayout = (content) => `
<div class="min-h-screen bg-slate-950 text-white">

  ${navbar()}

  <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    ${content}
  </main>

</div>
`;

/**
 * Inicializa el layout del dashboard
 */
export const initDashboardLayout = () => {
  initNavbar();
};
