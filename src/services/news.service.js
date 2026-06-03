// news.service.js
// Handles full CRUD HTTP requests for news articles against JSON-Server.
import { fetchAllCategories } from "./categories.service.js";

// News object structure: { id, title, content, categoryId, author, createdAt }

const BASE_URL = "http://localhost:3000/news";

/**
 * Fetches all news articles from the database.
 * @returns {Promise<Array>} Array of news objects, or empty array on failure.
 */
export async function fetchAllNews() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return [];
  }
}

export async function fetchAllNewsWithCategories() {
  const [news, categories] = await Promise.all([
    fetchAllNews(),
    fetchAllCategories(),
  ]);

  return news.map((article) => ({
    ...article,
    category: categories.find((category) => String(category.id) === String(article.categoryId)) ?? null,
  }));
}

/**
 * Fetches a single news article by its unique ID.
 * @param {number|string} newsId - The ID of the article to retrieve.
 * @returns {Promise<Object|null>} The news object, or null on failure.
 */
export async function fetchNewsById(newsId) {
  try {
    const response = await fetch(`${BASE_URL}/${newsId}`);
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchNewsByIdWithCategory(newsId) {
  const [article, categories] = await Promise.all([
    fetchNewsById(newsId),
    fetchAllCategories(),
  ]);

  if (!article) return null;

  return {
    ...article,
    category: categories.find((category) => String(category.id) === String(article.categoryId)) ?? null,
  };
}

/**
 * Creates a new news article and persists it to the database.
 * @param {{ title: string, content: string }} newsData - The data for the new article.
 * @returns {Promise<Object|null>} The created news object with its generated ID, or null on failure.
 */
export async function createNewsArticle(newsData) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newsData),
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Replaces an existing news article entirely (PUT).
 * @param {number|string} newsId - The ID of the article to replace.
 * @param {{ title: string, content: string }} newsData - The complete updated article data.
 * @returns {Promise<Object|null>} The updated news object, or null on failure.
 */
export async function updateNewsArticleById(newsId, newsData) {
  try {
    const response = await fetch(`${BASE_URL}/${newsId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newsData),
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Deletes a news article permanently from the database.
 * @param {number|string} newsId - The ID of the article to delete.
 * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
 */
export async function deleteNewsArticleById(newsId) {
  try {
    const response = await fetch(`${BASE_URL}/${newsId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return true;
  } catch {
    return false;
  }
}
