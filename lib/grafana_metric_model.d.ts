export declare type GrafanaDatasource = {
    url: string;
    type: string;
    params: {
        db: string;
        q: string;
        epoch: string;
    };
};
export declare type GrafanaMetricId = string;
export declare class GrafanaMetric {
    datasource: GrafanaDatasource;
    targets: any[];
    id?: GrafanaMetricId;
    private _metricQuery;
    constructor(datasource: GrafanaDatasource, targets: any[], id?: GrafanaMetricId);
    readonly metricQuery: MetricQuery;
    toObject(): {
        datasource: GrafanaDatasource;
        targets: any[];
        _id: string;
    };
    static fromObject(obj: any): GrafanaMetric;
}
export declare class MetricQuery {
    private static INFLUX_QUERY_TIME_REGEX;
    private _queryParts;
    private _type;
    constructor(metric: GrafanaMetric);
    getQuery(from: number, to: number, limit: number, offset: number): string;
}
