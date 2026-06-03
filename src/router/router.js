import { routeConfig } from "./routes";
import { ROUTES} from "./constants.routes"
import { canAccessRoute } from "./protected.routes";
import { navigate } from "../utils/navigate";
import { getUserRole } from "../utils/storage";

const app = () => document.querySelector("#app");

const notFoundPage = () => `
  <main class="min-h-screen bg-slate-950 text-white grid place-items-center px-4">
    <section class="max-w-md text-center">
      <p class="text-sm font-semibold uppercase tracking-wide text-cyan-300">404</p>
      <h1 class="mt-3 text-3xl font-black">Ruta no encontrada</h1>
      <p class="mt-3 text-slate-400">La pagina solicitada no existe o fue movida.</p>
      <button id="not-found-home" class="mt-6 rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400">
        Volver al inicio
      </button>
    </section>
  </main>
`;

const matchRoute = (path) => {
    const direct = routeConfig[path];
    if (direct) return { route: direct, params: {} };

    const showPrefix = `${ROUTES.SHOW_DETAILS}/`;
    if (path.startsWith(showPrefix)) {
        const id = path.slice(showPrefix.length).split("/")[0];
        return { route: routeConfig[`${ROUTES.SHOW_DETAILS}/:id`], params: { id } };
    }

    const newsPrefix = `${ROUTES.NEWS}/`;
    if (path.startsWith(newsPrefix)) {
        const id = path.slice(newsPrefix.length).split("/")[0];
        return { route: routeConfig[`${ROUTES.NEWS}/:id`], params: { id } };
    }

    if (path.startsWith("/show/")) {
        const id = path.split("/")[2];
        navigate(`${ROUTES.SHOW_DETAILS}/${id}`, { replace: true });
        return { route: null, params: {} };
    }

    return { route: null, params: {} };
};

export const renderRoute = async () => {
    const path = window.location.pathname;
    const role = getUserRole();
    const { route, params } = matchRoute(path);

    if (!route) {
        app().innerHTML = notFoundPage();
        document.getElementById("not-found-home")?.addEventListener("click", () => navigate(ROUTES.ROOT));
        return;
    }

    if (route.redirect) {
        navigate(route.redirect({ role }), { replace: true });
        return;
    }

    if (!canAccessRoute(route)) {
        if (role === "guest") {
            navigate(ROUTES.LOGIN, { replace: true });
            return;
        }
        if (role === "admin") {
            navigate(ROUTES.ADMIN, { replace: true });
            return;
        }
        navigate(ROUTES.HOME, { replace: true });
        return;
    }

    app().innerHTML = route.layout
        ? route.layout(await route.page(params))
        : await route.page(params);
    route.layoutInit?.();
    await route.init?.(params);
};
