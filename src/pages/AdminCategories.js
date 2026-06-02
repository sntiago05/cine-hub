// AdminCategories.js
// Renders the HTML shell synchronously via AdminCategories(),
// then fetches and manages categories asynchronously via initAdminCategories().

import {
  fetchAllCategories,
  createCategory,
  deleteCategoryById
} from "../services/categories.service.js";

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
    const categories = await fetchAllCategories();
    
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
        <span class="text-sm font-medium">${cat.name}</span>
        <button 
          data-action="delete-category" 
          data-id="${cat.id}" 
          class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition duration-150 cursor-pointer"
          title="Delete Category"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
          </svg>
        </button>
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

    await createCategory({ name: nameInput });
    form.reset();
    await renderCategoriesList();
  });

  document.getElementById(CATEGORIES_CONTAINER_ID)?.addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest('[data-action="delete-category"]');
    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    await deleteCategoryById(id);
    await renderCategoriesList();
  });
}