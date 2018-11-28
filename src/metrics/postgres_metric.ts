import { AbstractMetric, Datasource, MetricId } from './metric';

export class PostgresMetric extends AbstractMetric {

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
    console.log(datasource);
    console.log(this.datasource);
  }

  getQuery(from: number, to: number, limit: number, offset: number) {
    return {
      data: {
        from: `${from}`,
        to: `${to}`,
        queries: this.datasource['data']['queries']
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
    let results = res.data.results.A;
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
