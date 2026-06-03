import { Loader } from "../components/Loader";
import { categoryFilterButton, newsCard } from "../components/newsCard";
import { fetchAllCategories } from "../services/categories.service";
import { fetchAllNewsWithCategories } from "../services/news.service";
import { navigate } from "../utils/navigate";

let allNews = [];
let categories = [];
let activeCategoryId = "all";

const renderNewsGrid = () => {
  const grid = document.getElementById("news-grid");
  const empty = document.getElementById("news-empty-state");
  if (!grid || !empty) return;

  const visibleNews = activeCategoryId === "all"
    ? allNews
    : allNews.filter((article) => String(article.categoryId) === String(activeCategoryId));

  if (visibleNews.length === 0) {
    grid.innerHTML = "";
    empty.textContent = allNews.length === 0
      ? "No news available at the moment."
      : "No news found in this category.";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  grid.innerHTML = visibleNews.map(newsCard).join("");
};

const renderCategoryFilters = () => {
  const container = document.getElementById("news-category-filters");
  if (!container) return;

  container.innerHTML = [
    categoryFilterButton({ id: "all", name: "All" }, activeCategoryId),
    ...categories.map((category) => categoryFilterButton(category, activeCategoryId)),
  ].join("");
};

export const NewsPage = () => `
  <section class="mx-auto w-full max-w-7xl py-4 sm:py-8">
    <header class="mb-8">
      <h1 class="text-3xl font-black sm:text-4xl">Latest News</h1>
      <p class="mt-2 text-slate-400">Updates, releases, streaming notes, and TV highlights.</p>
    </header>

    <div id="news-category-filters" class="mb-8 flex flex-wrap gap-2"></div>

    <div id="news-loading">
      ${Loader("Loading news...")}
    </div>

    <p id="news-empty-state" class="hidden rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-slate-400"></p>

    <div id="news-grid" class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"></div>
  </section>
`;

export const initNewsPage = async () => {
  const loading = document.getElementById("news-loading");

  try {
    [allNews, categories] = await Promise.all([
      fetchAllNewsWithCategories(),
      fetchAllCategories(),
    ]);
    allNews = allNews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } finally {
    loading?.classList.add("hidden");
  }

  renderCategoryFilters();
  renderNewsGrid();

  document.getElementById("news-category-filters")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-id]");
    if (!button) return;
    activeCategoryId = button.dataset.categoryId;
    renderCategoryFilters();
    renderNewsGrid();
  });

  document.getElementById("news-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-route]");
    if (!button) return;
    navigate(button.dataset.route);
  });
};
