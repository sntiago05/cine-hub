// AdminDashboard.js
// Admin dashboard view — renders the HTML shell synchronously via AdminDashboard(),
// then hydrates the stats grid asynchronously via initAdminDashboard().
// This separation follows the router contract: page() → init?().

import { fetchAllUsers }      from "../services/users.service";
import { fetchAllNews }       from "../services/news.service";
import { fetchAllCategories } from "../services/categories.service";
import { StatsCard }          from "../components/StatsCard";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Temporary static value — replace once the favorites service is implemented. */
const FAVORITES_PLACEHOLDER = 12;

/**
 * Declarative configuration for each metric card.
 * To add a new metric, simply push a new entry here — no other function needs to change.
 *
 * @type {Array<{ id: string, title: string, icon: string }>}
 */
const STATS_CARDS_CONFIG = [
  {
    id: "users",
    title: "Total Users",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0
                  00 4-4h1m4 0a4 4 0 100-8 4 4 0 000 8zm6 0a3
                  3 0 100-6 3 3 0 000 6zM3 20a3 3 0 100-6 3 3
                  0 000 6z"/>
           </svg>`,
  },
  {
    id: "favorites",
    title: "Total Favorites",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5
                  4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0
                  010-6.364z"/>
           </svg>`,
  },
  {
    id: "news",
    title: "Total News",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4
                  4v10a2 2 0 01-2 2zM9 12h6M9 16h4"/>
           </svg>`,
  },
  {
    id: "categories",
    title: "Total Categories",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
           </svg>`,
  },
];

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Fetches all metric counts concurrently from JSON-Server.
 * Individual failures default to 0 — the dashboard never crashes due to a
 * single endpoint being unavailable.
 *
 * @returns {Promise<{ users: number, favorites: number, news: number, categories: number }>}
 */
async function fetchDashboardMetrics() {
  const [users, news, categories] = await Promise.all([
    fetchAllUsers(),
    fetchAllNews(),
    fetchAllCategories(),
  ]);

  return {
    users:      users.length,
    favorites:  FAVORITES_PLACEHOLDER,
    news:       news.length,
    categories: categories.length,
  };
}

/**
 * Builds the populated stats grid HTML from live metric values.
 *
 * @param {{ users: number, favorites: number, news: number, categories: number }} metrics
 * @returns {string} HTML string with all StatsCard components inside a responsive grid.
 */
function buildStatsGrid(metrics) {
  const cards = STATS_CARDS_CONFIG
    .map(({ id, title, icon }) => StatsCard({ title, value: metrics[id], icon }))
    .join("");

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      ${cards}
    </div>
  `;
}

/**
 * Builds the skeleton loading grid shown while metrics are being fetched.
 * Matches the exact dimensions of the real StatsCard to prevent layout shifts.
 *
 * @returns {string} HTML string with 4 animated pulse placeholders.
 */
function buildSkeletonGrid() {
  const skeletons = Array.from({ length: 4 }, () => `
    <div class="flex items-center gap-4 bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-2xl p-6 w-full animate-pulse">
      <div class="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0"></div>
      <div class="flex flex-col gap-2 flex-1 min-w-0">
        <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-7 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  `).join("");

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      ${skeletons}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Router contract exports
// ---------------------------------------------------------------------------

/**
 * AdminDashboard — synchronous shell renderer.
 * Called by the router as route.page() to inject the base HTML into #app immediately.
 * Contains skeleton placeholders that initAdminDashboard() will replace with live data.
 *
 * @returns {string} The full static HTML shell for the admin dashboard view.
 */
export function AdminDashboard() {
  return `
    <section class="flex flex-col gap-8 p-6 md:p-10 min-h-screen
                    bg-gray-50 dark:bg-gray-900">

      <!-- Page header -->
      <header class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Platform overview — live metrics from the database.
        </p>
      </header>

      <!-- Stats grid — skeletons shown until initAdminDashboard() resolves -->
      <div id="dashboard-stats-grid">
        ${buildSkeletonGrid()}
      </div>

    </section>
  `;
}

/**
 * initAdminDashboard — asynchronous data hydration function.
 * Called by the router as route.init?.() after AdminDashboard() has been mounted.
 * Fetches metric counts from JSON-Server and replaces the skeleton grid with live StatsCards.
 *
 * @returns {Promise<void>}
 */
export async function initAdminDashboard() {
  const statsContainer = document.getElementById("dashboard-stats-grid");
  if (!statsContainer) return;

  const metrics = await fetchDashboardMetrics();
  statsContainer.innerHTML = buildStatsGrid(metrics);
}