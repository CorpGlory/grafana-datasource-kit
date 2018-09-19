import { AbsractMetric, Datasource, MetricId } from "./metric";
export declare class GraphiteMetric extends AbsractMetric {
    constructor(datasource: Datasource, targets: any[], id?: MetricId);
    getQuery(from: number, to: number, limit: number, offset: number): string;
}
