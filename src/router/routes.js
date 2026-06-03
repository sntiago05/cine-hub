import  { initLoginForm, LoginPage } from "../pages/LoginPage.js";
import { ROUTES } from "./constants.routes";
import { RegisterPage, initRegisterForm } from "../pages/RegisterPage";
import { homePage, initHomePage } from "../pages/HomePage";
import { ShowDetailsPage, initShowDetailsPage } from "../pages/ShowDetailsPage";
import { NewsPage, initNewsPage } from "../pages/NewsPage";
import { NewsDetailPage, initNewsDetailPage } from "../pages/NewsDetailPage";
import { FavoritesPage, initFavoritesPage } from "../pages/FavoritePage";
import { ProfilePage, initProfilePage } from "../pages/ProfilePage";
import { authLayout } from "../layouts/authLayout";
import { dashboardLayout, initDashboardLayout } from "../layouts/dashboardLayout";

// Importaciones de tus módulos de administración:
import { AdminDashboard, initAdminDashboard } from "../pages/AdminDashboard.js";
import { AdminUsers, initAdminUsers } from "../pages/AdminUsers.js";
import { AdminNews, initAdminNews } from "../pages/AdminNews.js";
import { AdminCategories, initAdminCategories } from "../pages/AdminCategories.js";

export const routeConfig = {
    [ROUTES.ROOT]: {
        redirect: ({ role }) => role === "admin" ? ROUTES.ADMIN : role === "user" ? ROUTES.HOME : ROUTES.LOGIN,
        roles: ["guest", "user", "admin"]
    },

    [ROUTES.LOGIN]: {
        page: LoginPage,
        init: initLoginForm,
        layout: authLayout,
        roles: ["guest"]
    },

    [ROUTES.REGISTER]: {
        page: RegisterPage,
        init: initRegisterForm,
        layout: authLayout,
        roles: ["guest"]
    },
    [ROUTES.HOME]: {
        page: homePage,
        init: initHomePage,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["user"]
    },
    [`${ROUTES.SHOW_DETAILS}/:id`]: {
        page: ShowDetailsPage,
        init: initShowDetailsPage,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["user"]
    },
    [ROUTES.NEWS]: {
        page: NewsPage,
        init: initNewsPage,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["user"]
    },
    [`${ROUTES.NEWS}/:id`]: {
        page: NewsDetailPage,
        init: initNewsDetailPage,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["user"]
    },
    [ROUTES.FAVORITES]: {
        page: FavoritesPage,
        init: initFavoritesPage,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["user"]
    },
    [ROUTES.PROFILE]: {
        page: ProfilePage,
        init: initProfilePage,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["user"]
    },
    [ROUTES.ADMIN]: {
        page: AdminDashboard,
        init: initAdminDashboard,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["admin"]
    },
    [ROUTES.ADMIN_USERS]: {
        page: AdminUsers,
        init: initAdminUsers,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["admin"]
    },
    [ROUTES.ADMIN_NEWS]: {
        page: AdminNews,
        init: initAdminNews,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["admin"]
    },
    [ROUTES.ADMIN_CATEGORIES]: {
        page: AdminCategories,
        init: initAdminCategories,
        layout: dashboardLayout,
        layoutInit: initDashboardLayout,
        roles: ["admin"]
    }
};
