import { getUserRole } from "../utils/storage";
/**
 * Checks whether the current user is allowed to access a route.
 *
 * Access is determined by comparing the user's role with the
 * list of allowed roles defined in the route configuration.
 *
 * @param {string} path - The route path to validate.
 * @returns {boolean} Returns `true` if the user's role is allowed
 * to access the route; otherwise returns `false`.
 */
export const canAccessRoute = (route) => {
    const role = getUserRole();
    if (!route) return false;
    return route.roles.includes(role);
};
