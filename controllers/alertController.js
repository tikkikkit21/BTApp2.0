import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./util";

const ROOT = process.env.BT_API_ROOT;
const ALERTS = [];
var hasCached = false;

/**
 * Get list of alerts
 * @returns {Promise<any[]>} list of alerts
 */
export async function getAlerts() {
    if (hasCached) return ALERTS;

    // use the below code instead in production
    // const { data } = await axios.get(`${ROOT}/GetActiveAlerts?alertTypes=&alertCauses=&alertEffects=`);
    const { data } = await axios.get(`${ROOT}/GetAllAlerts`);
    const json = xml2js(data, { compact: true });

    let alerts = json.DocumentElement.ActiveAlerts;
    if (alerts.Error?._text?.startsWith("No active alerts found for requested alert type(s):")) {
        return [];
    }
    alerts = alerts.map(alert => formatTextProperty(alert));

    ALERTS.push(...alerts);
    hasCached = true;
    return alerts;
}
