import { AbsractMetric, Datasource, MetricId } from "./metric";
export declare class InfluxdbMetric extends AbsractMetric {
    private static INFLUX_QUERY_TIME_REGEX;
    private _queryParts;
    constructor(datasource: Datasource, targets: any[], id?: MetricId);
    getQuery(from: number, to: number, limit: number, offset: number): string;
}
