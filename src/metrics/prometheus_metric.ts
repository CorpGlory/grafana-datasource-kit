import { AbsractMetric, Datasource, MetricId } from './metric';

const QUERY_TIME_REGEX = /\&start=[^\&]*\&end=[^\&]*\&/;

export class PrometheusMetric extends AbsractMetric {

  private _queryParts: string[];

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);

    this._queryParts = datasource.type.split(QUERY_TIME_REGEX);
  }

  getQuery(from: number, to: number, limit: number, offset: number): string {
    return `${this._queryParts[0]}&start=${from}&end=${to}&${this._queryParts[1]}`;
  }

  getResults(res) {
    if(res.data === undefined || res.data.length < 1) {
      console.log('datasource return empty response, no data');
      return {
        columns: ['timestamp', 'target'],
        values: []
      };
    }

    let metric_name = '';
    for(let key in res.data.data.result[0].metric) {
      metric_name = `${metric_name ? `${metric_name}:` : '' }${key}=${res.data.data.result[0].metric[key]}`;
    }

    return {
      columns: ['timestamp', metric_name],
      values: res.data.data.result[0].values
    };
  }
}
