"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const influxdb_metric_1 = require("./influxdb_metric");
const graphite_metric_1 = require("./graphite_metric");
const prometheus_metric_1 = require("./prometheus_metric");
function metricFactory(datasource, targets, id) {
    let class_map = {
        'influxdb': influxdb_metric_1.InfluxdbMetric,
        'graphite': graphite_metric_1.GraphiteMetric,
        'prometheus': prometheus_metric_1.PrometheusMetric
    };
    return new class_map[datasource.type](datasource, targets);
}
exports.metricFactory = metricFactory;
class Metric {
    constructor(datasource, targets, id) {
        this._metricQuery = undefined;
        if (datasource === undefined) {
            throw new Error('datasource is undefined');
        }
        if (targets === undefined) {
            throw new Error('targets is undefined');
        }
        if (targets.length === 0) {
            throw new Error('targets is empty');
        }
        this.datasource = datasource;
        this.targets = targets;
        this.id = id;
    }
    get metricQuery() {
        if (this._metricQuery === undefined) {
            this._metricQuery = metricFactory(this.datasource, this.targets, this.id);
        }
        return this._metricQuery;
    }
    toObject() {
        return {
            datasource: this.datasource,
            targets: this.targets,
            _id: this.id
        };
    }
    static fromObject(obj) {
        if (obj === undefined) {
            throw new Error('obj is undefined');
        }
        return metricFactory(obj.datasource, obj.targets, obj._id);
    }
}
exports.Metric = Metric;
//# sourceMappingURL=metrics_factory.js.map