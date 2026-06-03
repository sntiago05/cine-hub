import { confirmDialog, toast } from "../components/feedback.js";
import { ROUTES } from "../router/constants.routes.js";
import { deleteUserById, fetchAllUsers, updateUserById } from "../services/users.service.js";
import { navigate } from "../utils/navigate.js";
import { clearSession, getSession, saveSession } from "../utils/storage.js";
import { escapeHtml } from "../utils/utils.js";

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

const ADMIN_USERS_PAGE_ID = "admin-users-page";
const USERS_TABLE_BODY_ID = "users-table-body";
const AVAILABLE_ROLES = ["admin", "user"];

/**
 * Resolves the Tailwind badge classes for a given role string.
 *
 * @param {string} role - The user's role value from the database.
 * @returns {string} Tailwind CSS class string for the badge.
 */
function resolveBadgeClasses(role) {
  return ROLE_BADGE_CLASSES[role?.toLowerCase()] ?? ROLE_BADGE_FALLBACK;
}

function buildRoleOptions(selectedRole) {
  return AVAILABLE_ROLES.map((role) => `
    <option value="${role}" ${role === selectedRole ? "selected" : ""}>
      ${role}
    </option>
  `).join("");
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
    <tr data-user-id="${user.id}"
        data-user-name="${escapeHtml(user.name ?? "")}"
        data-user-email="${escapeHtml(user.email ?? "")}"
        data-user-role="${escapeHtml(user.role ?? "user")}"
        class="border-b border-gray-100 dark:border-gray-700
               hover:bg-gray-50 dark:hover:bg-gray-700/40
               transition-colors duration-150">

      <td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
        ${escapeHtml(user.name ?? "—")}
      </td>

      <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        ${escapeHtml(user.email ?? "—")}
      </td>

      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full
                     text-xs font-semibold tracking-wide capitalize
                     ${badgeClasses}">
          ${escapeHtml(user.role ?? "unknown")}
        </span>
      </td>

      <td class="px-6 py-4 whitespace-nowrap">
        <select
          data-action="change-role"
          data-id="${user.id}"
          class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium
                 text-gray-700 outline-none transition-colors duration-150
                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100">
          ${buildRoleOptions(user.role ?? "user")}
        </select>
      </td>

      <td class="px-6 py-4 whitespace-nowrap">
        <button
          data-action="delete-user"
          data-id="${user.id}"
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
        <td colspan="5"
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
      <td class="px-6 py-4">
        <div class="h-9 w-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
      <td class="px-6 py-4">
        <div class="h-7 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </td>
    </tr>
  `).join("");
}

async function refreshUsersTable() {
  const tableBody = document.getElementById(USERS_TABLE_BODY_ID);
  if (!tableBody) return;

  const users = await fetchAllUsers();
  tableBody.innerHTML = buildUserTableBody(users);
}

async function handleRoleChange(target) {
  const userId = target.dataset.id;
  const newRole = target.value;
  const row = target.closest("tr[data-user-id]");
  const previousRole = row?.dataset.userRole ?? "user";

  if (newRole === previousRole) return;

  const updatedUser = await updateUserById(userId, { role: newRole });
  if (!updatedUser) {
    target.value = previousRole;
    toast("No se pudo actualizar el rol", "error");
    return;
  }

  const session = getSession();
  if (String(session?.id) === String(userId)) {
    saveSession(updatedUser);
    toast("Tu rol fue actualizado");
    navigate(newRole === "admin" ? ROUTES.ADMIN : ROUTES.HOME, { replace: true });
    return;
  }

  toast("Rol actualizado");
  await refreshUsersTable();
}

async function handleDeleteUser(target) {
  const userId = target.dataset.id;
  const row = target.closest("tr[data-user-id]");
  const userName = row?.dataset.userName || "este usuario";
  const confirmed = await confirmDialog({
    title: "Eliminar usuario",
    message: `Se eliminará permanentemente a ${userName}.`,
    confirmText: "Eliminar",
    danger: true,
  });

  if (!confirmed) return;

  const deleted = await deleteUserById(userId);
  if (!deleted) {
    toast("No se pudo eliminar el usuario", "error");
    return;
  }

  const session = getSession();
  if (String(session?.id) === String(userId)) {
    clearSession();
    toast("Tu usuario fue eliminado");
    navigate(ROUTES.LOGIN, { replace: true });
    return;
  }

  toast("Usuario eliminado");
  await refreshUsersTable();
}

async function handleAdminUsersChange(event) {
  const target = event.target.closest('[data-action="change-role"]');
  if (!target) return;
  await handleRoleChange(target);
}

async function handleAdminUsersClick(event) {
  const target = event.target.closest('[data-action="delete-user"]');
  if (!target) return;
  await handleDeleteUser(target);
}

/**
 * AdminUsers — synchronous HTML shell renderer.
 * Called by the router as route.page() to mount the base structure into #app.
 * The <tbody> is pre-filled with skeleton rows until initAdminUsers() resolves.
 *
 * @returns {string} Full static HTML string for the admin users view.
 */
export function AdminUsers() {
  return `
    <section id="${ADMIN_USERS_PAGE_ID}" class="flex flex-col gap-8 p-4 sm:p-6 md:p-10 min-h-screen
                    bg-gray-50 dark:bg-gray-900">

      <header class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          User Management
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Change roles and remove registered users from the platform.
        </p>
      </header>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm
                  border border-gray-200 dark:border-gray-700 overflow-hidden">

        <div class="overflow-x-auto">
          <table class="w-full text-left">

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
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider
                           text-gray-500 dark:text-gray-400">
                  Change role
                </th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider
                           text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody id="${USERS_TABLE_BODY_ID}">
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
  const tableBody = document.getElementById(USERS_TABLE_BODY_ID);
  if (!tableBody) return;

  await refreshUsersTable();

  const page = document.getElementById(ADMIN_USERS_PAGE_ID);
  page?.addEventListener("change", handleAdminUsersChange);
  page?.addEventListener("click", handleAdminUsersClick);
}
