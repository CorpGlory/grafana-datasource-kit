import { AbstractMetric, Datasource, MetricId } from './metric';

const QUERY_TIME_REGEX = /\&start=[^\&]*\&end=[^\&]*\&/;

export class PrometheusMetric extends AbstractMetric {

  private _queryParts: string[];

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);

    this._queryParts = datasource.type.split(QUERY_TIME_REGEX);
  }

  getQuery(from: number, to: number, limit: number, offset: number): string {
    return `${this._queryParts[0]}&start=${from}&end=${to}&${this._queryParts[1]}`;
  }

  getResults(res) {
    if(res.data === undefined || res.data.result.length < 1) {
      console.log('datasource return empty response, no data');
      return {
        columns: ['timestamp', 'target'],
        values: []
      };
    }

    let result_matrix = {
      columns: ['timestamp'],
      values: []
    };

    console.log(res.data);

    Array.apply(result_matrix.columns.push, res.data.data.result.map(r => {
      let keys = [];
      for(let key in res.data.data.result[0].metric) {
        keys.push(`${key}=${res.data.data.result[0].metric[key]}`);
      }
      return keys.join(':');
    }));

    let values = res.data.result.map(r => {return r.values});
    console.log(values);
    let timestamps = [];
    for(let v of values) {
      timestamps.push(v[0]);
    }

    return result_matrix;
  }
}
