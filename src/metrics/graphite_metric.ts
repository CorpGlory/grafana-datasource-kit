import { Metric, GrafanaDatasource, GrafanaMetricId  } from "./metric";

export class GraphiteMetric extends Metric {

    constructor(datasource: GrafanaDatasource, targets: any[], id?: GrafanaMetricId) {
      super(datasource, targets, id);
    }

    getQuery(from: number, to: number, limit: number, offset: number): string {
      return ''; //mock
    }
}