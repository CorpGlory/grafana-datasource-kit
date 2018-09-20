"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const axios_1 = require("axios");
const CHUNK_SIZE = 50000;
/**
 * @param metric to query to Grafana
 * @returns { values: [time, value][], columns: string[] }
 */
function queryByMetric(metric, panelUrl, from, to, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let datasource = metric.datasource;
        let origin = new url_1.URL(panelUrl).origin;
        let url = `${origin}/${datasource.url}`;
        let params = datasource.params;
        let data = {
            values: [],
            columns: []
        };
        let chunkParams = Object.assign({}, params);
        while (true) {
            chunkParams.q = metric.metricQuery.getQuery(from, to, CHUNK_SIZE, data.values.length);
            var chunk = yield queryGrafana(url, apiKey, chunkParams);
            let values = chunk.values;
            data.values = data.values.concat(values);
            data.columns = chunk.columns;
            if (values.length < CHUNK_SIZE) {
                // because if we get less that we could, then there is nothing more
                break;
            }
        }
        return data;
    });
}
exports.queryByMetric = queryByMetric;
function queryGrafana(url, apiKey, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let headers = { Authorization: `Bearer ${apiKey}` };
        try {
            var res = yield axios_1.default.get(url, { headers });
        }
        catch (e) {
            if (e.response.status === 401) {
                throw new Error('Unauthorized. Check the $HASTIC_API_KEY.');
            }
            throw new Error(e.message);
        }
        if (res.data.results === undefined) {
            throw new Error('results field is undefined in response.');
        }
        // TODO: support more than 1 metric (each res.data.results item is a metric)
        let results = res.data.results[0];
        if (results.series === undefined) {
            return [];
        }
        return results.series[0];
    });
}
//# sourceMappingURL=grafana_service.js.map