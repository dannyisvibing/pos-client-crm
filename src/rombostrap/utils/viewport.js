// We wrap strings within the JSON with additional quotes so they can be read by SASS. Remove those here so they're
// just straight strings.
const VIEWPORT_JSON = require('./viewportData.json');
const VIEWPORT_DATA = JSON.stringify(VIEWPORT_JSON).replace(/"'|'"/g, '"');

export default JSON.parse(VIEWPORT_DATA);
