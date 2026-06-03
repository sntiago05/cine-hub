import { ROUTES } from "../router/constants.routes";
import { escapeHtml, stripHtml } from "../utils/utils";

export const formatNewsDate = (date) => {
  if (!date) return "Sin fecha";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const summarizeNews = (content = "", length = 130) => {
  const clean = stripHtml(content).trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trim()}...`;
};

export const newsCard = (article) => `
  <article class="flex h-full flex-col rounded-lg border border-slate-800 bg-slate-900 p-5">
    <div class="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
      <span class="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-200">
        ${escapeHtml(article.category?.name ?? "Uncategorized")}
      </span>
      <span class="text-slate-500">${escapeHtml(formatNewsDate(article.createdAt))}</span>
    </div>

    <h3 class="text-xl font-bold text-white">${escapeHtml(article.title ?? "Untitled")}</h3>
    <p class="mt-3 flex-1 text-sm leading-6 text-slate-400">
      ${escapeHtml(summarizeNews(article.content))}
    </p>

    <button
      data-news-id="${article.id}"
      data-route="${ROUTES.NEWS}/${article.id}"
      class="read-news-btn mt-5 w-fit rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      Read More
    </button>
  </article>
`;

export const categoryFilterButton = ({ id, name }, activeCategoryId = "all") => `
  <button
    data-category-id="${id}"
    class="category-filter rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
      String(activeCategoryId) === String(id)
        ? "bg-cyan-500 text-slate-950"
        : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-cyan-200"
    }"
  >
    ${escapeHtml(name)}
  </button>
`;
