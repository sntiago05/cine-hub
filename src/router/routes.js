import { LoginPage, initLoginForm } from "../pages/LoginPage";
import { ROUTES } from "./constants.routes";
import { RegisterPage, initRegisterForm } from "../pages/RegisterPage";
import { homePage, initHomePage } from "../pages/HomePage";

export const routeConfig = {

    [ROUTES.LOGIN]: {
        page: LoginPage,
        init: initLoginForm,
        roles: ["guest"]
    },

    [ROUTES.REGISTER]: {
        page: RegisterPage,
        init: initRegisterForm,
        roles: ["guest"]
    }

};
/**
 * 
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
    }

 */