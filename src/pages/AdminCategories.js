// AdminCategories.js
// Renders the HTML shell synchronously via AdminCategories(),
// then fetches and manages categories asynchronously via initAdminCategories().

import {
  fetchAllCategories,
  createCategory,
  deleteCategoryById,
  updateCategoryById
} from "../services/categories.service.js";
import { fetchAllNews } from "../services/news.service.js";
import { confirmDialog, setButtonLoading, toast } from "../components/feedback.js";
import { escapeHtml } from "../utils/utils.js";

const CATEGORIES_CONTAINER_ID = "categories-container";
const CATEGORY_FORM_ID = "category-form";

export function AdminCategories() {
  return `
    <section class="flex flex-col gap-8 p-6 md:p-10 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      
      <!-- Header -->
      <header class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold">Category Management</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Create and remove movie or series categories for Cine-Hub.
        </p>
      </header>

      <!-- Form and List Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Create Form Card -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 h-fit">
          <h2 class="text-base font-semibold mb-4">Add New Category</h2>
          <form id="${CATEGORY_FORM_ID}" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="category-name" class="text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
              <input 
                id="category-name" 
                name="name" 
                type="text" 
                placeholder="e.g., Action, Sci-Fi" 
                required 
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              />
            </div>
            <button type="submit" class="w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 cursor-pointer">
              Create Category
            </button>
          </form>
        </div>

        <!-- Categories List Grid (2 columns on large screens) -->
        <div class="lg:col-span-2">
          <div id="${CATEGORIES_CONTAINER_ID}" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Dynamic category cards or skeletons will be injected here -->
            <div class="text-sm text-gray-400 dark:text-gray-500 animate-pulse">Loading categories...</div>
          </div>
        </div>

      </div>
    </section>
  `;
}

async function renderCategoriesList() {
  const container = document.getElementById(CATEGORIES_CONTAINER_ID);
  if (!container) return;

  try {
    const [categories, news] = await Promise.all([
      fetchAllCategories(),
      fetchAllNews(),
    ]);
    
    if (categories.length === 0) {
      container.innerHTML = `
        <div class="sm:col-span-2 text-center py-8 text-sm text-gray-400 dark:text-gray-500">
          No categories found. Create your first one above!
        </div>
      `;
      return;
    }

    container.innerHTML = categories.map(cat => `
      <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <span class="text-sm font-medium">${escapeHtml(cat.name)}</span>
          <p class="mt-1 text-xs text-gray-400">
            ${news.filter((article) => String(article.categoryId) === String(cat.id)).length} news articles
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            data-action="edit-category"
            data-id="${cat.id}"
            data-name="${escapeHtml(cat.name)}"
            class="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300"
          >
            Edit
          </button>
          <button 
            data-action="delete-category" 
            data-id="${cat.id}" 
            class="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    `).join("");

  } catch (error) {
    container.innerHTML = `
      <div class="sm:col-span-2 text-center py-8 text-sm text-red-400">
        Error loading categories data.
      </div>
    `;
  }
}

export async function initAdminCategories() {
  await renderCategoriesList();

  const form = document.getElementById(CATEGORY_FORM_ID);
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = form.name.value.trim();
    if (!nameInput) return;

    const stopLoading = setButtonLoading(form.querySelector('button[type="submit"]'), "Creando...");
    try {
      const created = await createCategory({ name: nameInput });
      if (!created) throw new Error("Request failed");
      form.reset();
      toast("Category created");
      await renderCategoriesList();
    } catch {
      toast("API failure while creating category", "error");
    } finally {
      stopLoading();
    }
  });

  document.getElementById(CATEGORIES_CONTAINER_ID)?.addEventListener("click", async (e) => {
    const editBtn = e.target.closest('[data-action="edit-category"]');
    if (editBtn) {
      const card = editBtn.closest("div.flex");
      card.innerHTML = `
        <form data-action="edit-category-form" data-id="${editBtn.dataset.id}" class="flex w-full flex-col gap-3 sm:flex-row">
          <input name="name" value="${escapeHtml(editBtn.dataset.name)}" required class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          <div class="flex gap-2">
            <button type="submit" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">Save</button>
            <button type="button" data-action="cancel-category-edit" class="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">Cancel</button>
          </div>
        </form>
      `;
      return;
    }

    if (e.target.closest('[data-action="cancel-category-edit"]')) {
      await renderCategoriesList();
      return;
    }

    const deleteBtn = e.target.closest('[data-action="delete-category"]');
    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;
    const confirmed = await confirmDialog({
      title: "Delete category",
      message: "This category will be permanently removed.",
      confirmText: "Delete",
      danger: true
    });
    if (!confirmed) return;

    try {
      const deleted = await deleteCategoryById(id);
      if (!deleted) throw new Error("Request failed");
      toast("Category deleted");
      await renderCategoriesList();
    } catch {
      toast("API failure while deleting category", "error");
    }
  });

  document.getElementById(CATEGORIES_CONTAINER_ID)?.addEventListener("submit", async (e) => {
    const editForm = e.target.closest('[data-action="edit-category-form"]');
    if (!editForm) return;
    e.preventDefault();
    const name = editForm.name.value.trim();
    if (!name) return;

    const stopLoading = setButtonLoading(editForm.querySelector('button[type="submit"]'), "Saving...");
    try {
      const updated = await updateCategoryById(editForm.dataset.id, { name });
      if (!updated) throw new Error("Request failed");
      toast("Category updated");
      await renderCategoriesList();
    } catch {
      toast("API failure while updating category", "error");
    } finally {
      stopLoading();
    }
  });
}
