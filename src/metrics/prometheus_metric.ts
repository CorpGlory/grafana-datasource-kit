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
    
    if(res.data === undefined || res.data.data.result.length < 1) {
      console.log('datasource return empty response, no data');
      return {
        columns: ['timestamp', 'target'],
        values: []
      };
    }

    let result = res.data.data.result;
    let result_matrix = {
      columns: ['timestamp'],
      values: []
    };

    result.map(r => {
      let keys = [];
      for(let key in r.metric) {
        keys.push(`${key}=${r.metric[key]}`);
      }
      result_matrix.columns.push(keys.join(':'));
    });

    let values = result.map(r => {return r.values});

    let timestamps = [];
    for(let v of values) {
      timestamps.push(v[0]);
    }

    timestamps = timestamps.filter(function(item, i, ar) { 
      return ar.indexOf(item) === i;
    });

    let values_gen = values.map(v => { return function* () {
      let i = 0;
      yield v[i++];
    }}).map(f => {
      return f();
    });
    let current_values = values_gen.map(v => { return v.next(); });

    for(let t of timestamps) {
      let row = [t];
      current_values.map(c => {
        console.log(c);
        if(c[0] === t) {
          row.push(c[1]);
          c = values_gen.next();
        } else {
          row.push('');
        }
      });

      result_matrix.values.push(row);
    }

    return result_matrix;
  }
}
