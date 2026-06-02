import { routeConfig } from "./routes";
import { ROUTES} from "./constants.routes"
import { canAccessRoute } from "./protected.routes";
//import { navigate } from "../utils/navigate";
import { isAuthenticated, getUserRole } from "../utils/storage";

export const renderRoute = () => {

    const path = window.location.pathname;
    if (path.startsWith(`${ROUTES.SHOW_DETAILS}/`)) {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }
        const id = path.split("/")[2];
        document.querySelector("#app").innerHTML = ShowDetailsPage(id);
        initShowDetailsPage?.();
        return;
    }
    const route = routeConfig[path];
    if (!route) {
        document.querySelector("#app").innerHTML = "<h1>404</h1>";
        return;
    }
    if (!canAccessRoute(path)) {
        const role = getUserRole();
        if (role === "guest") {
            navigate(ROUTES.LOGIN);
            return;
        }
        if (role === "admin") {
            navigate(ROUTES.ADMIN);
            return;
        }
        navigate(ROUTES.HOME);

        return;
    }


    document.querySelector("#app").innerHTML = route.page();
    route.init?.();
};