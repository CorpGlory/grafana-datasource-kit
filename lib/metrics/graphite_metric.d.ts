import { AbsractMetric, Datasource, MetricId } from './metric';
export declare class GraphiteMetric extends AbsractMetric {
    private static QUERY_TIME_REGEX;
    private static MAX_DATA_POINTS_REGEX;
    private _queryParts;
    constructor(datasource: Datasource, targets: any[], id?: MetricId);
    getQuery(from: number, to: number, limit: number, offset: number): string;
    getResults(res: any): {
        columns: any[];
        values: any[][];
    };
}
