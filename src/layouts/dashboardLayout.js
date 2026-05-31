import { Navbar } from "../components/Navbar";

export const dashboardLayout = (content) => `
<div class="min-h-screen bg-slate-950 text-white">

  ${Navbar()}

  <main class="max-w-7xl mx-auto p-6">
    ${content}
  </main>

</div>
`;