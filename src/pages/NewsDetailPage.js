import { Loader } from "../components/Loader";
import { formatNewsDate } from "../components/newsCard";
import { fetchNewsByIdWithCategory } from "../services/news.service";
import { navigate } from "../utils/navigate";
import { ROUTES } from "../router/constants.routes";
import { escapeHtml } from "../utils/utils";

const renderArticle = (article) => `
  <article class="mx-auto max-w-3xl py-4 sm:py-8">
    <button data-route="${ROUTES.NEWS}" class="back-news-btn mb-6 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
      Back to news
    </button>

    <div class="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold">
      <span class="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-200">
        ${escapeHtml(article.category?.name ?? "Uncategorized")}
      </span>
      <span class="text-slate-500">${escapeHtml(formatNewsDate(article.createdAt))}</span>
    </div>

    <h1 class="text-4xl font-black leading-tight sm:text-5xl">
      ${escapeHtml(article.title ?? "Untitled")}
    </h1>

    <p class="mt-4 text-sm text-slate-500">
      ${article.author ? `By ${escapeHtml(article.author)}` : "By CineHub editorial"}
    </p>

    <div class="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6 text-base leading-8 text-slate-300">
      ${escapeHtml(article.content ?? "No content available.").replaceAll("\n", "<br>")}
    </div>
  </article>
`;

const renderNotFound = () => `
  <section class="mx-auto max-w-3xl py-16 text-center">
    <p class="text-sm font-semibold uppercase tracking-wide text-cyan-300">News</p>
    <h1 class="mt-3 text-3xl font-black">News article not found</h1>
    <button data-route="${ROUTES.NEWS}" class="back-news-btn mt-6 rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400">
      Back to news
    </button>
  </section>
`;

export const NewsDetailPage = () => `
  <section id="news-detail-container">
    ${Loader("Loading news detail...")}
  </section>
`;

export const initNewsDetailPage = async ({ id }) => {
  const container = document.getElementById("news-detail-container");
  if (!container) return;

  const article = await fetchNewsByIdWithCategory(id);
  container.innerHTML = article ? renderArticle(article) : renderNotFound();

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-route]");
    if (!button) return;
    navigate(button.dataset.route);
  });
};
