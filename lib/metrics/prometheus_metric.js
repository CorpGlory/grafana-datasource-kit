"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metric_1 = require("./metric");
class PrometheusMetric extends metric_1.AbsractMetric {
    constructor(datasource, targets, id) {
        super(datasource, targets, id);
    }
    getQuery(from, to, limit, offset) {
        return '';
    }
}
exports.PrometheusMetric = PrometheusMetric;
//# sourceMappingURL=prometheus_metric.js.map