// Handles full CRUD HTTP requests for categories against JSON Server.

const BASE_URL = "http://localhost:3000/categories";

/**
 * Fetches all categories from the database.
 * @returns {Promise<Array>} Array of category objects, or empty array on failure.
 */
export async function fetchAllCategories() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return [];
  }
}

/**
 * Fetches a single category by its unique ID.
 * @param {number|string} categoryId - The ID of the category to retrieve.
 * @returns {Promise<Object|null>} The category object, or null on failure.
 */
export async function fetchCategoryById(categoryId) {
  try {
    const response = await fetch(`${BASE_URL}/${categoryId}`);
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Creates a new category and persists it to the database.
 * @param {{ name: string }} categoryData - The data for the new category.
 * @returns {Promise<Object|null>} The created category object with its generated ID, or null on failure.
 */
export async function createCategory(categoryData) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Replaces an existing category entirely (PUT).
 * @param {number|string} categoryId - The ID of the category to replace.
 * @param {{ name: string }} categoryData - The complete updated category data.
 * @returns {Promise<Object|null>} The updated category object, or null on failure.
 */
export async function updateCategoryById(categoryId, categoryData) {
  try {
    const response = await fetch(`${BASE_URL}/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Deletes a category permanently from the database.
 * @param {number|string} categoryId - The ID of the category to delete.
 * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
 */
export async function deleteCategoryById(categoryId) {
  try {
    const response = await fetch(`${BASE_URL}/${categoryId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return true;
  } catch {
    return false;
  }
}
