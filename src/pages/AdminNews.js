// AdminNews.js
// Admin news view — renders the HTML shell synchronously via AdminNews(),
// then fetches and injects news rows asynchronously via initAdminNews().
// Follows the router contract: page() → init?().

import {
  fetchAllNewsWithCategories,
  createNewsArticle,
  updateNewsArticleById,
  deleteNewsArticleById,
} from "../services/news.service.js";
import { fetchAllCategories } from "../services/categories.service.js";
import { confirmDialog, setButtonLoading, toast } from "../components/feedback.js";
import { escapeHtml } from "../utils/utils.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** ID of the table body element where news rows are injected. */
const NEWS_TABLE_BODY_ID = "news-table-body";

/** ID of the modal container element. */
const NEWS_MODAL_ID = "news-modal";

/** ID of the modal form element. */
const NEWS_FORM_ID = "news-form";
let categoriesCache = [];

// ---------------------------------------------------------------------------
// Private helpers — rendering
// ---------------------------------------------------------------------------

/**
 * Builds a single table row HTML string from a news article object.
 *
 * @param {{ id: number|string, title: string, content: string }} article
 * @returns {string} HTML string for a <tr> element.
 */
function buildCategoryOptions(selectedCategoryId = "") {
  return categoriesCache.map((category) => `
    <option value="${category.id}" ${String(category.id) === String(selectedCategoryId) ? "selected" : ""}>
      ${escapeHtml(category.name)}
    </option>
  `).join("");
}

function getCategoryName(article) {
  return article.category?.name
    ?? categoriesCache.find((category) => String(category.id) === String(article.categoryId))?.name
    ?? "Uncategorized";
}

function buildNewsTableRow(article) {
  return `
    <tr data-news-id="${article.id}"
        data-category-id="${article.categoryId ?? ""}"
        data-author="${escapeHtml(article.author ?? "")}"
        data-created-at="${escapeHtml(article.createdAt ?? "")}"
        class="border-b border-gray-100 dark:border-gray-700
               hover:bg-gray-50 dark:hover:bg-gray-700/40
               transition-colors duration-150">

      <!-- Title -->
      <td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
        ${escapeHtml(article.title ?? "—")}
      </td>

      <!-- Content preview -->
      <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
        ${escapeHtml(article.content ?? "—")}
      </td>

      <td class="px-6 py-4 whitespace-nowrap">
        <span class="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
          ${escapeHtml(getCategoryName(article))}
        </span>
      </td>

      <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        ${escapeHtml(article.createdAt ?? "—")}
      </td>

      <!-- Actions -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center gap-2">

          <button
            data-action="edit-news"
            data-id="${article.id}"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                   font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100
                   dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/60
                   transition-colors duration-150 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0
                   112.828 2.828L11.828 15.828A2 2 0 0110.414
                   16H9v-1.414A2 2 0 019.586 13z"/>
            </svg>
            Edit
          </button>

          <button
            data-action="delete-news"
            data-id="${article.id}"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                   font-medium bg-red-50 text-red-600 hover:bg-red-100
                   dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/60
                   transition-colors duration-150 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                   01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16"/>
            </svg>
            Delete
          </button>

        </div>
      </td>

    </tr>
  `;
}

/**
 * Builds the full <tbody> content from an array of news articles.
 * Renders an empty-state row when the array is empty.
 *
 * @param {Array<Object>} articles - Array of news objects from JSON-Server.
 * @returns {string} HTML string for all <tr> elements.
 */
function buildNewsTableBody(articles) {
  if (articles.length === 0) {
    return `
      <tr>
        <td colspan="5"
            class="px-6 py-12 text-center text-sm
                   text-gray-400 dark:text-gray-500">
          No news articles found. Click "Add News" to create the first one.
        </td>
      </tr>
    `;
  }

  return articles.map(buildNewsTableRow).join("");
}

/**
 * Builds animated skeleton rows shown while news data is being fetched.
 *
 * @returns {string} HTML string with 5 animated pulse placeholder rows.
 */
function buildSkeletonRows() {
  return Array.from({ length: 5 }, () => `
    <tr class="border-b border-gray-100 dark:border-gray-700">
      <td class="px-6 py-4">
        <div class="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
      <td class="px-6 py-4">
        <div class="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
      <td class="px-6 py-4">
        <div class="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
      <td class="px-6 py-4">
        <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
      <td class="px-6 py-4">
        <div class="flex gap-2">
          <div class="h-7 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div class="h-7 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
      </td>
    </tr>
  `).join("");
}

// ---------------------------------------------------------------------------
// Private helpers — modal
// ---------------------------------------------------------------------------

/**
 * Builds the HTML string for the create/edit modal dialog.
 * When an article is provided, the form fields are pre-filled for editing.
 *
 * @param {{ id: number|string, title: string, content: string, categoryId?: number|string, author?: string, createdAt?: string } | null} article
 * - Pass an article object to open the modal in edit mode.
 * - Pass null to open it in create mode.
 * @returns {string} HTML string for the modal overlay.
 */
function buildNewsModal(article = null) {
  const isEditing   = article !== null;
  const modalTitle  = isEditing ? "Edit Article" : "Add News";
  const submitLabel = isEditing ? "Save Changes" : "Create Article";

  return `
    <div id="${NEWS_MODAL_ID}"
         class="fixed inset-0 z-50 flex items-center justify-center
                bg-black/50 backdrop-blur-sm p-4">

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl
                  w-full max-w-lg border border-gray-200 dark:border-gray-700">

        <!-- Modal header -->
        <div class="flex items-center justify-between px-6 py-4
                    border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-800 dark:text-gray-100">
            ${modalTitle}
          </h2>
          <button data-action="close-news-modal"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                         transition-colors duration-150 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Modal form -->
        <form id="${NEWS_FORM_ID}" data-editing-id="${article?.id ?? ""}"
              class="flex flex-col gap-5 px-6 py-5">

          <!-- Title field -->
          <div class="flex flex-col gap-1.5">
            <label for="news-title"
                   class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              id="news-title"
              name="title"
              type="text"
              placeholder="Enter article title"
              value="${isEditing ? escapeHtml(article.title) : ""}"
              required
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     px-3.5 py-2.5 outline-none
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition duration-150"/>
          </div>

          <!-- Content field -->
          <div class="flex flex-col gap-1.5">
            <label for="news-content"
                   class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              id="news-content"
              name="content"
              rows="4"
              placeholder="Write the article content here..."
              required
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     px-3.5 py-2.5 outline-none resize-none
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition duration-150">${isEditing ? escapeHtml(article.content) : ""}</textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label for="news-category"
                     class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="news-category"
                name="categoryId"
                required
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100
                       px-3.5 py-2.5 outline-none
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       transition duration-150">
                <option value="">Choose category</option>
                ${buildCategoryOptions(article?.categoryId ?? "")}
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="news-date"
                     class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Publication date
              </label>
              <input
                id="news-date"
                name="createdAt"
                type="date"
                value="${isEditing ? escapeHtml(article.createdAt ?? "") : new Date().toISOString().slice(0, 10)}"
                required
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100
                       px-3.5 py-2.5 outline-none
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       transition duration-150"/>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="news-author"
                   class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Author
            </label>
            <input
              id="news-author"
              name="author"
              type="text"
              placeholder="CineHub editorial"
              value="${isEditing ? escapeHtml(article.author ?? "") : ""}"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     px-3.5 py-2.5 outline-none
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition duration-150"/>
          </div>

          <!-- Form actions -->
          <div class="flex justify-end gap-3 pt-1">
            <button type="button"
                    data-action="close-news-modal"
                    class="px-4 py-2 rounded-lg text-sm font-medium
                           text-gray-600 dark:text-gray-300 bg-gray-100
                           dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                           transition-colors duration-150 cursor-pointer">
              Cancel
            </button>
            <button type="submit"
                    class="px-4 py-2 rounded-lg text-sm font-medium text-white
                           bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500
                           dark:hover:bg-indigo-600 transition-colors duration-150
                           cursor-pointer">
              ${submitLabel}
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Private helpers — DOM utilities
// ---------------------------------------------------------------------------

/**
 * Refreshes the table body with the latest news data from JSON-Server.
 * Called after every successful create, update, or delete operation.
 *
 * @returns {Promise<void>}
 */
async function refreshNewsTable() {
  const tableBody = document.getElementById(NEWS_TABLE_BODY_ID);
  if (!tableBody) return;

  const articles = await fetchAllNewsWithCategories();
  tableBody.innerHTML = buildNewsTableBody(articles);
}

/**
 * Opens the modal by injecting it into the document body.
 *
 * @param {{ id: number|string, title: string, content: string } | null} article
 * - Pass an article to pre-fill the form (edit mode).
 * - Pass null for an empty form (create mode).
 */
function openNewsModal(article = null) {
  document.body.insertAdjacentHTML("beforeend", buildNewsModal(article));
}

/**
 * Closes and removes the modal from the DOM.
 */
function closeNewsModal() {
  document.getElementById(NEWS_MODAL_ID)?.remove();
}

// ---------------------------------------------------------------------------
// Private helpers — event handlers
// ---------------------------------------------------------------------------

/**
 * Handles the news form submission for both create and update operations.
 * Determines the mode by reading the data-editing-id attribute on the form.
 *
 * @param {SubmitEvent} event
 * @returns {Promise<void>}
 */
async function handleNewsFormSubmit(event) {
  event.preventDefault();

  const form      = document.getElementById(NEWS_FORM_ID);
  const editingId = form.dataset.editingId;
  const payload   = {
    title:   form.title.value.trim(),
    content: form.content.value.trim(),
    categoryId: Number(form.categoryId.value),
    author: form.author.value.trim() || "CineHub editorial",
    createdAt: form.createdAt.value,
  };

  const submitButton = form.querySelector('button[type="submit"]');
  const stopLoading = setButtonLoading(submitButton, editingId ? "Guardando..." : "Creando...");

  try {
    const result = editingId
      ? await updateNewsArticleById(editingId, payload)
      : await createNewsArticle(payload);

    if (!result) throw new Error("Request failed");

    toast(editingId ? "News updated" : "News created");
    closeNewsModal();
    await refreshNewsTable();
  } catch {
    toast("API failure while saving news", "error");
  } finally {
    stopLoading();
  }
}

/**
 * Handles click events delegated from the news table and modal.
 * Uses data-action attributes to determine which operation to execute.
 *
 * @param {MouseEvent} event
 * @returns {Promise<void>}
 */
async function handleNewsPageClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  if (action === "open-add-news-modal") {
    openNewsModal(null);
    attachNewsFormListener();
    return;
  }

  if (action === "close-news-modal") {
    closeNewsModal();
    return;
  }

  if (action === "edit-news") {
    const articleId = target.dataset.id;
    const row       = target.closest("tr[data-news-id]");
    const title     = row.querySelector("td:nth-child(1)")?.textContent.trim();
    const content   = row.querySelector("td:nth-child(2)")?.textContent.trim();
    const categoryId = row.dataset.categoryId;
    const author = row.dataset.author;
    const createdAt = row.dataset.createdAt;

    openNewsModal({ id: articleId, title, content, categoryId, author, createdAt });
    attachNewsFormListener();
    return;
  }

  if (action === "delete-news") {
    const articleId = target.dataset.id;
    const confirmed = await confirmDialog({
      title: "Delete news",
      message: "This article will be permanently removed.",
      confirmText: "Delete",
      danger: true
    });
    if (!confirmed) return;

    const deleted = await deleteNewsArticleById(articleId);
    if (!deleted) {
      toast("API failure while deleting news", "error");
      return;
    }
    toast("News deleted");
    await refreshNewsTable();
  }
}

/**
 * Attaches the submit event listener to the news form inside the modal.
 * Must be called each time the modal is injected into the DOM.
 */
function attachNewsFormListener() {
  const form = document.getElementById(NEWS_FORM_ID);
  form?.addEventListener("submit", handleNewsFormSubmit);
}

// ---------------------------------------------------------------------------
// Router contract exports
// ---------------------------------------------------------------------------

/**
 * AdminNews — synchronous HTML shell renderer.
 * Called by the router as route.page() to mount the base structure into #app.
 * The <tbody> is pre-filled with skeleton rows until initAdminNews() resolves.
 *
 * @returns {string} Full static HTML string for the admin news view.
 */
export function AdminNews() {
  return `
    <section id="admin-news-page" class="flex flex-col gap-8 p-4 sm:p-6 md:p-10 min-h-screen
                    bg-gray-50 dark:bg-gray-900">

      <!-- Page header -->
      <header class="flex items-center justify-between gap-4 flex-wrap">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            News Management
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Create, edit and remove news articles from the platform.
          </p>
        </div>

        <button
          data-action="open-add-news-modal"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm
                 font-medium text-white bg-indigo-600 hover:bg-indigo-700
                 dark:bg-indigo-500 dark:hover:bg-indigo-600
                 transition-colors duration-150 cursor-pointer shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 4v16m8-8H4"/>
          </svg>
          Add News
        </button>
      </header>

      <!-- Table card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm
                  border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">

            <!-- Table header -->
            <thead class="bg-gray-50 dark:bg-gray-700/60
                          border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-3 text-xs font-semibold uppercase
                           tracking-wider text-gray-500 dark:text-gray-400">
                  Title
                </th>
                <th class="px-6 py-3 text-xs font-semibold uppercase
                           tracking-wider text-gray-500 dark:text-gray-400">
                  Content Preview
                </th>
                <th class="px-6 py-3 text-xs font-semibold uppercase
                           tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th class="px-6 py-3 text-xs font-semibold uppercase
                           tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th class="px-6 py-3 text-xs font-semibold uppercase
                           tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <!-- Table body — skeletons shown until initAdminNews() resolves -->
            <tbody id="${NEWS_TABLE_BODY_ID}">
              ${buildSkeletonRows()}
            </tbody>

          </table>
        </div>
      </div>

    </section>
  `;
}

/**
 * initAdminNews — asynchronous data hydration and event binding function.
 * Called by the router as route.init?.() after AdminNews() has been mounted.
 * Fetches all news articles and registers the delegated click listener for the page.
 *
 * @returns {Promise<void>}
 */
export async function initAdminNews() {
  const tableBody = document.getElementById(NEWS_TABLE_BODY_ID);
  if (!tableBody) return;

  categoriesCache = await fetchAllCategories();
  const articles = await fetchAllNewsWithCategories();
  tableBody.innerHTML = buildNewsTableBody(articles);

  document.getElementById("admin-news-page")?.addEventListener("click", handleNewsPageClick);
}
