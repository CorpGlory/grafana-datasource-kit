import { AbstractMetric, Datasource, MetricId, MetricQuery, MetricResults  } from './metric';

import * as _ from 'lodash';
import * as moment from 'moment';


export class GraphiteMetric extends AbstractMetric {

  private _queryParts: string[];

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
  }

  getQuery(from: number, to: number, limit: number, offset: number): MetricQuery {
    let moment_format = 'h:mm_YYYYMMDD';
    let from_date = moment(from).format(moment_format);
    let to_date = moment(to).format(moment_format);

    let fromRegex = /from=[^\&]+/i;
    let untilRegex = /until=[^\&]+/i;
    let limitRegex = /maxDataPoints=[^\&]+/i;

    let query: string = this.datasource.data;
    let replacements: [RegExp, string][] = [
      [fromRegex, `from=${from_date}`],
      [untilRegex, `until=${to_date}`],
      [limitRegex, `maxDataPoints=${limit}`]
    ];

    _.each(replacements, r => {
      let k = r[0];
      let v = r[1];
      if(query.search(k)) {
        query = query.replace(k, v);
      } else {
        query += v;
      }
    });

    return {
      url: `${this.datasource.url}?${query}`,
      method: 'GET',
      schema: {
        params: this.datasource.params
      }
    }
  }

  getResults(res): MetricResults {

    if(res.data === undefined || res.data.length < 1) {
      console.log('datasource return empty response, no data');
      return {
        columns: ['timestamp', 'target'],
        values: []
      };
    }

    return {
      columns: ['timestamp', res.data[0]['target']],
      values: res.data[0].datapoints.map(point => {
        let val = point[0];
        let timestamp = point[1] * 1000; //convert seconds -> ms
        return [timestamp, val];
      })
    };
  }
}

