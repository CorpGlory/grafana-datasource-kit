import { AbsractMetric, Datasource, MetricId } from './metric';

export class PrometheusMetric extends AbsractMetric {

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
  }

  getQuery(from: number, to: number, limit: number, offset: number): string {
    return '';
  }
}
