import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./util";

const ROOT = process.env.BT_API_ROOT;

/**
 * Fetches info on every bus that's currently running
 * 
 * @returns list of bus info as JS objects
 */
export async function getAllBuses() {
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`);
    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.LatestInfoTable;

    json = json.map(b => formatTextProperty(b));
    return json;
}

/**
 * Fetches info about a particular bus
 * 
 * @param {string} shortName abbreviated bus name (ex: "HWA")
 * @returns info on bus as JS object
 */
export async function getBus(shortName) {
    const buses = await getAllBuses();
    const bus = buses.find(b => b.RouteShortName == shortName);
    return bus;
}
