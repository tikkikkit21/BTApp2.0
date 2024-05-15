import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./util";

const ROOT = process.env.BT_API_ROOT;

// caches
const CURRENT_ROUTES = [];
const ROUTE_COLORS = {};
const ROUTE_POLYLINES = {};

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

/**
 * Get color of a route, returns black if not found
 * @param {string} routeName route short name (ex: "HWA")
 * @returns color of the route or "#000" by default
 */
export async function getColor(routeName) {
    if (CURRENT_ROUTES.length === 0) await getCurrentRoutes();

    const color = ROUTE_COLORS[routeName];
    return color
        ? `#${ROUTE_COLORS[routeName]}`
        : "#000";
}

/**
 * Get polyline coordinates for a route
 * @param {string} routeName route short name (ex: "HWA")
 * @returns array of stop objects
 */
export async function getRoutePolyline(routeName) {
    if (ROUTE_POLYLINES[routeName]) return ROUTE_POLYLINES[routeName];

    const { data } = await axios.get(`${ROOT}/GetScheduledPatternPoints?patternName=${routeName}`);
    const json = xml2js(data, { compact: true });

    let polyData = json.DocumentElement[routeName];
    polyData = polyData.map(p => formatTextProperty(p));
    ROUTE_POLYLINES[routeName] = polyData;

    return polyData;
}
