// AdminUsers.js
// Admin users view — renders the HTML shell synchronously via AdminUsers(),
// then fetches and injects user rows asynchronously via initAdminUsers().
// Follows the router contract: page() → init?().

import { fetchAllUsers } from "../services/users.service.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Role badge color mapping — each role gets a distinct visual style.
 * Add new roles here without touching any rendering logic.
 *
 * @type {Record<string, string>}
 */
const ROLE_BADGE_CLASSES = {
  admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  user:  "bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300",
};

/** Fallback badge style for unknown or undefined roles. */
const ROLE_BADGE_FALLBACK =
  "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the Tailwind badge classes for a given role string.
 *
 * @param {string} role - The user's role value from the database.
 * @returns {string} Tailwind CSS class string for the badge.
 */
function resolveBadgeClasses(role) {
  return ROLE_BADGE_CLASSES[role?.toLowerCase()] ?? ROLE_BADGE_FALLBACK;
}

/**
 * Builds a single table row HTML string from a user object.
 *
 * @param {{ id: number|string, name: string, email: string, role: string }} user
 * @returns {string} HTML string for a <tr> element.
 */
function buildUserTableRow(user) {
  const badgeClasses = resolveBadgeClasses(user.role);

  return `
    <tr class="border-b border-gray-100 dark:border-gray-700
               hover:bg-gray-50 dark:hover:bg-gray-700/40
               transition-colors duration-150">

      <!-- Name -->
      <td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
        ${user.name ?? "—"}
      </td>

      <!-- Email -->
      <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        ${user.email ?? "—"}
      </td>

      <!-- Role badge -->
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full
                     text-xs font-semibold tracking-wide capitalize
                     ${badgeClasses}">
          ${user.role ?? "unknown"}
        </span>
      </td>

    </tr>
  `;
}

/**
 * Builds the full <tbody> content from an array of user objects.
 * Renders an empty-state row when the array is empty.
 *
 * @param {Array<Object>} users - Array of user objects from JSON-Server.
 * @returns {string} HTML string for all <tr> elements.
 */
function buildUserTableBody(users) {
  if (users.length === 0) {
    return `
      <tr>
        <td colspan="3"
            class="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
          No users found in the database.
        </td>
      </tr>
    `;
  }

  return users.map(buildUserTableRow).join("");
}

/**
 * Builds the skeleton loading rows shown while user data is being fetched.
 * Renders 5 animated placeholder rows that match the table column structure.
 *
 * @returns {string} HTML string with animated pulse skeleton rows.
 */
function buildSkeletonRows() {
  return Array.from({ length: 5 }, () => `
    <tr class="border-b border-gray-100 dark:border-gray-700">
      <td class="px-6 py-4">
        <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
      <td class="px-6 py-4">
        <div class="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
      <td class="px-6 py-4">
        <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
    </tr>
  `).join("");
}

// ---------------------------------------------------------------------------
// Router contract exports
// ---------------------------------------------------------------------------

/**
 * AdminUsers — synchronous HTML shell renderer.
 * Called by the router as route.page() to mount the base structure into #app.
 * The <tbody> is pre-filled with skeleton rows until initAdminUsers() resolves.
 *
 * @returns {string} Full static HTML string for the admin users view.
 */
export function AdminUsers() {
  return `
    <section class="flex flex-col gap-8 p-6 md:p-10 min-h-screen
                    bg-gray-50 dark:bg-gray-900">

      <!-- Page header -->
      <header class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          User Management
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          All registered users on the platform.
        </p>
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
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider
                           text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider
                           text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider
                           text-gray-500 dark:text-gray-400">
                  Role
                </th>
              </tr>
            </thead>

            <!-- Table body — skeletons shown until initAdminUsers() resolves -->
            <tbody id="users-table-body">
              ${buildSkeletonRows()}
            </tbody>

          </table>
        </div>

      </div>

    </section>
  `;
}

/**
 * initAdminUsers — asynchronous data hydration function.
 * Called by the router as route.init?.() after AdminUsers() has been mounted.
 * Fetches all users from JSON-Server and injects the populated rows into the table body.
 *
 * @returns {Promise<void>}
 */
export async function initAdminUsers() {
  const tableBody = document.getElementById("users-table-body");
  if (!tableBody) return;

  const users = await fetchAllUsers();
  tableBody.innerHTML = buildUserTableBody(users);
}