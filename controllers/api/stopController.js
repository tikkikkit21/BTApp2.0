import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./util";

const ROOT = process.env.BT_API_ROOT;
const STOPS = {};

/**
 * Fetches all stops for a route
 * @param {string} routeCode route name abbreviation (ex: "HWA")
 * @returns list of stops for that route
 */
export async function getStops(routeCode) {
    if (STOPS[routeCode]) return STOPS[routeCode];

    const { data } = await axios.get(`${ROOT}/GetScheduledStopInfo?routeShortName=${routeCode}&serviceDate=`);
    const json = xml2js(data, { compact: true });

    let stops = json.DocumentElement.ScheduledStops;
    stops = stops.map(stop => formatTextProperty(stop));
    STOPS[routeCode] = stops;

    return stops;
}
