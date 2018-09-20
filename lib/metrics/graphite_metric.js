"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metric_1 = require("./metric");
const moment = require("moment");
class GraphiteMetric extends metric_1.AbsractMetric {
    constructor(datasource, targets, id) {
        super(datasource, targets, id);
        let queryStr = datasource['data'];
        this._queryParts = queryStr.split(GraphiteMetric.QUERY_TIME_REGEX);
        this._queryParts[1] = this._queryParts[1].split(GraphiteMetric.MAX_DATA_POINTS_REGEX)[0];
    }
    getQuery(from, to, limit, offset) {
        let moment_format = 'h:mm_YYYYMMDD';
        let from_date = moment(from).format(moment_format);
        let to_date = moment(to).format(moment_format);
        let timeClause = `&from=${from_date}&until=${to_date}`;
        return `?${this._queryParts[0]}${timeClause}&${this._queryParts[1]}&maxDataPoints=${limit}`;
    }
    getResults(res) {
        if (res.data[0] === undefined) {
            throw new Error('data is undefined in response.');
        }
        return { columns: [res.data[0]['target']],
            values: res.data[0]['datapoints'].map(function (point) {
                let val = point[0];
                let timestamp = point[1] * 1000; //move seconds -> ms
                return [timestamp, val];
            })
        };
    }
}
GraphiteMetric.QUERY_TIME_REGEX = /\&from=[^\&]+\&until=[^\&]+\&/;
GraphiteMetric.MAX_DATA_POINTS_REGEX = /\&maxDataPoints=[^\&]/;
exports.GraphiteMetric = GraphiteMetric;
//# sourceMappingURL=graphite_metric.js.map