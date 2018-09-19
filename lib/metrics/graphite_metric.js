"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metric_1 = require("./metric");
class GraphiteMetric extends metric_1.AbsractMetric {
    constructor(datasource, targets, id) {
        super(datasource, targets, id);
        console.log('DS', datasource);
        let queryStr = datasource['data'];
        this._queryParts = queryStr.split(GraphiteMetric.QUERY_TIME_REGEX);
        this._queryParts[1] = this._queryParts[1].split(GraphiteMetric.MAX_DATA_POINTS_REGEX)[0];
    }
    getQuery(from, to, limit, offset) {
        //move to seconds
        from = from / 1000;
        to = to / 1000;
        let timeClause = `&from=${from}s&until=${to}s`;
        return `${this._queryParts[0]}${timeClause}&${this._queryParts[1]}&maxDataPoints=${limit}`;
    }
}
GraphiteMetric.QUERY_TIME_REGEX = /\&from=[^\&]+\&until=[^\&]+\&/;
GraphiteMetric.MAX_DATA_POINTS_REGEX = /\&maxDataPoints=[^\&]/;
exports.GraphiteMetric = GraphiteMetric;
//# sourceMappingURL=graphite_metric.js.map