import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA_RECORDS_KEY = "usage-data";

/**
 * Saves a record of user usage
 * @param {Object} data data record
 * @param {string} data.route route the user looked at
 * @param {{lat: Number, long: Number}} data.coords location coordinates of user
 * @param {Date} data.time time the user checked route
 * @returns whether saving was successful or not
 */
export async function saveUsageDataRecord(data) {
    try {
        if (!data.time || !data.coords || !data.time) {
            throw new TypeError("Data record missing a field, see JSDoc for argument structure");
        }

        const storedRecords = await AsyncStorage.getItem(DATA_RECORDS_KEY);
        const records = storedRecords
            ? JSON.parse(storedRecords)
            : [];
        records.push(data);

        await AsyncStorage.setItem(DATA_RECORDS_KEY, JSON.stringify(records));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Clears storage of all data records
 * @returns whether deleting was successful or not
 */
export async function clearUsageData() {
    try {
        await AsyncStorage.setItem(DATA_RECORDS_KEY, JSON.stringify([]));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Uses provided data record to predict the route based on past app usage
 * @param {Object} data data record
 * @param {{lat: Number, long: Number}} data.coords location of user
 * @param {Date} data.time time the user checked route
 * @returns predicted route code (ex: "HWA") or null if none
 */
export async function getSuggestedRoute(data) {
    const storedRecords = await AsyncStorage.getItem(DATA_RECORDS_KEY);
    const records = storedRecords
        ? JSON.parse(storedRecords)
        : [];

    // not enough data to predict
    if (records.length < 5) return null;

    // find all similar records to provided data
    const similarRecords = records.filter(record => {
        record.time = new Date(record.time);
        return getSimilarity(data, record) <= 1.0;
    });

    // record each unique suggested route and their "votes"
    const routes = {};
    similarRecords.forEach(record => {
        if (!routes[record.route]) {
            routes[record.route] = 0;
        }

        routes[record.route]++;
    });

    // find most frequent route
    let maxCount = 0;
    let maxRoute = "";
    for (const route in routes) {
        if (routes[route] > maxCount) {
            maxCount = routes[route];
            maxRoute = route;
        }
    }

    // if route is suggested by at least 20% of all records, we accept
    if ((maxCount * 1.0) / records.length >= 0.2) {
        return maxRoute;
    }

    return null;
}

/**
 * Calculates how similar 2 data records are where 0 is identical, 1 is max
 * difference to consider the record. The lower the result, the more similar
 * they are
 * @returns how similar
 */
function getSimilarity(data1, data2) {
    // set date to same
    data1.time.setDate(data2.time.getDate());
    data1.time.setMonth(data2.time.getMonth());
    data1.time.setFullYear(data2.time.getFullYear());

    // time difference in seconds
    const timeDiff = Math.abs(data1.time.getTime() - data2.time.getTime()) / 1000;

    // location Euclidean distance
    const eDist = Math.sqrt(
        (data1.coords.lat - data2.coords.lat) ** 2
        + (data1.coords.long - data2.coords.long) ** 2
    );

    // time of 1 is half hour, dist of 1 is 150ft away
    const timeNorm = timeDiff / (60 * 30);
    const distNorm = eDist * 2065.0;

    // return average of the 2 similarities (assumes both features are equally
    // important)
    return (timeNorm + distNorm) / 2.0;
}
