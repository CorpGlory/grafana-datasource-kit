import { AbstractMetric, Datasource, MetricId  } from './metric';

import * as moment from 'moment';

const QUERY_TIME_REGEX = /\&from=[^\&]*\&until=[^\&]*\&/;
const MAX_DATA_POINTS_REGEX = /\&maxDataPoints=[^\&]+/;

export class GraphiteMetric extends AbstractMetric {

  private _queryParts: string[];

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
    let queryStr = datasource['data'];
    this._queryParts = queryStr.split(QUERY_TIME_REGEX);
    this._queryParts[1] = this._queryParts[1].split(MAX_DATA_POINTS_REGEX)[0];
  }

  getQuery(from: number, to: number, limit: number, offset: number): string {

    let moment_format = 'h:mm_YYYYMMDD';
    let from_date = moment(from).format(moment_format);
    let to_date = moment(to).format(moment_format);


    let timeClause = `&from=${from_date}&until=${to_date}`;
    return `?${this._queryParts[0]}${timeClause}&${this._queryParts[1]}&maxDataPoints=${limit}`;
  }

  getResults(res) {

    if(res.data !== undefined && res.data.length < 1) {
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
