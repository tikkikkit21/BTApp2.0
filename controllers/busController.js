import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./util";

const ROOT = process.env.BT_API_ROOT;

/**
 * Fetches info on every bus that's currently running=
 * @returns list of bus info
 */
export async function getAllBuses() {
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`);
    const json = xml2js(data, { compact: true });

    let buses = json.DocumentElement.LatestInfoTable;
    buses = buses.map(b => formatTextProperty(b));

    return buses;
}

/**
 * Fetches info about a particular bus
 * @param {string} shortName abbreviated bus name (ex: "HWA")
 * @returns info about the bus
 */
export async function getBus(shortName) {
    const buses = await getAllBuses();
    const bus = buses.find(b => b.RouteShortName == shortName);
    return bus;
}
