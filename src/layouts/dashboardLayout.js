import { navbar } from "../components/navBar";

export const dashboardLayout = (content) => `
<div class="min-h-screen bg-slate-950 text-white">

  ${navbar()}

  <main class="max-w-7xl mx-auto p-6">
    ${content}
  </main>

</div>
`;