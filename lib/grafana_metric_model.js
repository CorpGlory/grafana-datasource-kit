"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GrafanaMetric {
    constructor(datasource, targets, id) {
        this.datasource = datasource;
        this.targets = targets;
        this.id = id;
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
    }
    get metricQuery() {
        if (this._metricQuery === undefined) {
            this._metricQuery = new MetricQuery(this);
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
        return new GrafanaMetric(obj.datasource, obj.targets, obj._id);
    }
}
exports.GrafanaMetric = GrafanaMetric;
class MetricQuery {
    constructor(metric) {
        this._type = metric.datasource.type;
        if (this._type !== 'influxdb') {
            throw new Error(`Queries of type "${metric.datasource.type}" are not supported yet.`);
        }
        var queryStr = metric.datasource.params.q;
        this._queryParts = queryStr.split(MetricQuery.INFLUX_QUERY_TIME_REGEX);
        if (this._queryParts.length == 1) {
            throw new Error(`Query "${queryStr}" is not replaced with LIMIT/OFFSET oeprators. Missing time clause.`);
        }
        if (this._queryParts.length > 2) {
            throw new Error(`Query "${queryStr}" has multiple time clauses. Can't parse.`);
        }
    }
    getQuery(from, to, limit, offset) {
        let timeClause = `time >= ${from}ms AND time <= ${to}ms`;
        return `${this._queryParts[0]} ${timeClause} ${this._queryParts[1]} LIMIT ${limit} OFFSET ${offset}`;
    }
}
MetricQuery.INFLUX_QUERY_TIME_REGEX = /time >[^A-Z]+/;
exports.MetricQuery = MetricQuery;
//# sourceMappingURL=grafana_metric_model.js.map