import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./util";

const ROOT = process.env.BT_API_ROOT;
const CURRENT_ROUTES = [];

/**
 * Fetches info on current routes
 * @returns list of routes
 */
export async function getCurrentRoutes() {
    if (CURRENT_ROUTES.length > 1) return CURRENT_ROUTES;

    const { data } = await axios.get(`${ROOT}/GetCurrentRoutes`);
    const json = xml2js(data, { compact: true });

    let routes = json.DocumentElement.CurrentRoutes
    routes = routes.map(r => {
        r = formatTextProperty(r);
        ROUTE_COLORS[r.RouteShortName] = r.RouteColor;
        return r;
    });
    CURRENT_ROUTES.push(...routes);

    return routes;
}
