import { AbstractMetric, Datasource, MetricId, MetricQuery } from './metric';

export class PostgresMetric extends AbstractMetric {

  private _targetName; //save first target name, while multi metric not implemented

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
    this._targetName = targets[0].refId;
  }

  getQuery(from: number, to: number, limit: number, offset: number): MetricQuery {
    return {
      url: this.datasource.url,
      method: 'POST',
      schema: {
        data: {
          from: `${from}`,
          to: `${to}`,
          queries: this.datasource['data']['queries']
        }
      }
    };
  }

  getResults(res) {
    if(res.data === undefined || res.data.results.length < 1) {
      console.log('datasource return empty response, no data');
      return {
        columns: ['timestamp', 'target'],
        values: []
      };
    }

    // TODO: support more than 1 metric (each res.data.results item is a metric)
    let results = res.data.results[this._targetName];
    if (results.series === undefined) {
      return [];
      }

    let points = results.series[0].points;
    points.map(p => p.reverse());

    return {
      columns: ['timestamp', results.series[0].name],
      values: points
    };
  }
}
