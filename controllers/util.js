/**
 * Formats BT app data by removing unnecessary _text sub-property
 * @param {any[]} data an object in the form of { property: { _text: value } }
 * @returns formatted data in for the form of { property: value }
 */
export function formatTextProperty(data) {
    for (const key of Object.keys(data)) {
        data[key] = data[key]._text;
        if (!isNaN(Number(data[key]))) {
            data[key] = Number(data[key]);
        }
    }

    return data;
}
