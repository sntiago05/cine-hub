// users.service.js
// Handles all HTTP requests related to users against JSON-Server.
// NOTE: Users are created via the auth flow, not from the admin panel.
//       This service only exposes read and management operations.

const BASE_URL = "http://localhost:3000/users";

/**
 * Fetches all registered users from the database.
 * @returns {Promise<Array>} Array of user objects, or empty array on failure.
 */
export async function fetchAllUsers() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return [];
  }
}

/**
 * Fetches a single user by their unique ID.
 * @param {number|string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object|null>} The user object, or null on failure.
 */
export async function fetchUserById(userId) {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`);
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Updates an existing user's data partially (PATCH).
 * @param {number|string} userId - The ID of the user to update.
 * @param {Object} updatedFields - An object containing only the fields to update.
 * @returns {Promise<Object|null>} The updated user object, or null on failure.
 */
export async function updateUserById(userId, updatedFields) {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Deletes a user permanently from the database.
 * @param {number|string} userId - The ID of the user to delete.
 * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
 */
export async function deleteUserById(userId) {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error — status: ${response.status}`);
    return true;
  } catch {
    return false;
  }
}