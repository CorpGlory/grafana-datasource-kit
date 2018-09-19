import { AbsractMetric, Datasource, MetricId } from './metric';
export declare function metricFactory(datasource: Datasource, targets: any[], id?: MetricId): AbsractMetric;
export declare class Metric {
    datasource: Datasource;
    targets: any[];
    id?: MetricId;
    private _metricQuery;
    constructor(datasource: Datasource, targets: any[], id?: MetricId);
    readonly metricQuery: AbsractMetric;
    toObject(): {
        datasource: Datasource;
        targets: any[];
        _id: string;
    };
    static fromObject(obj: any): AbsractMetric;
}
