export const authLayout = (content) => `
<section
class="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6"
>
  <div
    class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8"
  >
    ${content}
  </div>
</section>
`;