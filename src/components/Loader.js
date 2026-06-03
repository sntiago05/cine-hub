export const Loader = (label = "Loading...") => `
  <div class="flex items-center justify-center gap-3 py-10 text-sm text-slate-400" role="status">
    <span class="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300"></span>
    <span>${label}</span>
  </div>
`;
