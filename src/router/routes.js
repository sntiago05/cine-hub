import  { initLoginForm,LoginPage } from "../pages/LoginPage.js";
import { ROUTES } from "./constants.routes";
import { RegisterPage, initRegisterForm } from "../pages/RegisterPage";

// Importaciones de tus módulos de administración:
import { AdminDashboard, initAdminDashboard } from "../pages/AdminDashboard.js";
import { AdminUsers, initAdminUsers } from "../pages/AdminUsers.js";
import { AdminNews, initAdminNews } from "../pages/AdminNews.js";
import { AdminCategories, initAdminCategories } from "../pages/AdminCategories.js";

export const routeConfig = {

    [ROUTES.LOGIN]: {
        page: LoginPage, // Usando la exportación corregida en minúscula
        init: initLoginForm,
        roles: ["guest","admin"]
    },

    [ROUTES.REGISTER]: {
        page: RegisterPage,
        init: initRegisterForm,
        roles: ["guest"]
    },

    [ROUTES.ADMIN]: {
        page: AdminDashboard,
        init: initAdminDashboard,
        roles: ["admin"]
    },

    [ROUTES.ADMIN_USERS]: {
        page: AdminUsers,
        init: initAdminUsers,
        roles: ["admin"]
    },

    [ROUTES.ADMIN_NEWS]: {
        page: AdminNews,
        init: initAdminNews,
        roles: ["admin"]
    },

    [ROUTES.ADMIN_CATEGORIES]: {
        page: AdminCategories,
        init: initAdminCategories,
        roles: ["admin"]
    },

};

/**
    [ROUTES.HOME]: {
        page: HomePage,
        init: initHomePage,
        roles: ["user", "admin"]
    },

    [ROUTES.FAVORITES]: {
        page: FavoritesPage,
        init: initFavoritesPage,
        roles: ["user"]
    },

    [ROUTES.PROFILE]: {
        page: ProfilePage,
        init: initProfilePage,
        roles: ["user"]
    }
 */