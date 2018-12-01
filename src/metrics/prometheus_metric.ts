import { AbstractMetric, Datasource, MetricId, MetricQuery } from './metric';

const QUERY_TIME_REGEX = /\&start=[^\&]*\&end=[^\&]*\&/;

export class PrometheusMetric extends AbstractMetric {

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
  }

  getQuery(from: number, to: number, limit: number, offset: number): MetricQuery {
    let url = this.datasource.url;
<<<<<<< HEAD
    from = Math.floor(from/1000); //prometheus uses seconds for timestamp
    to = Math.floor(to/1000);
=======
    from = Math.floor(from / 1000); // prometheus uses seconds for timestamp
    to = Math.floor(to / 1000);
>>>>>>> 34ee46c801a0675422b6238ec8171a28807db2ce

    url = url.replace(/\&start=[^\&]+/, `&start=${from}`);
    url = url.replace(/\&end=[^\&]+/, `&end=${to}`);
    return {
      url,
      method: 'GET',
      schema: {
        params: this.datasource.params
      }
    }
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

    let values = result.map(r => r.values);

    let timestamps = [];
    values.map(v => v.map(row => timestamps.push(row[0])));
    timestamps = timestamps.filter(function(item, i, ar) { 
      return ar.indexOf(item) === i; //uniq values
    });

    for(let t of timestamps) {
      let row = [t];
      values.map(v => {
        if(v[0] === undefined) {
          row.push(0);
        }

        let currentTimestamp = v[0][0];
        let currentValue = v[0][1];

        if(currentTimestamp === t) {
          row.push(currentValue);
          v.shift();
        }
        else {
          row.push('');
        }
      });
      result_matrix.values.push(row);
    };

    return result_matrix;
  }
}
