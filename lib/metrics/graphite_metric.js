"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metric_1 = require("./metric");
class GraphiteMetric extends metric_1.AbsractMetric {
    constructor(datasource, targets, id) {
        super(datasource, targets, id);
    }
    getQuery(from, to, limit, offset) {
        return ''; //mock
    }
}
exports.GraphiteMetric = GraphiteMetric;
//# sourceMappingURL=graphite_metric.js.map