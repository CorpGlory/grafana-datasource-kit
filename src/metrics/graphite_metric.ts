import { AbsractMetric, Datasource, MetricId  } from './metric';

import * as moment from 'moment';

export class GraphiteMetric extends AbsractMetric {

    private static QUERY_TIME_REGEX = /\&from=[^\&]+\&until=[^\&]+\&/;
    private static MAX_DATA_POINTS_REGEX = /\&maxDataPoints=[^\&]/;

    private _queryParts: string[];

    constructor(datasource: Datasource, targets: any[], id?: MetricId) {
      super(datasource, targets, id);
      let queryStr = datasource['data'];
      this._queryParts = queryStr.split(GraphiteMetric.QUERY_TIME_REGEX);
      this._queryParts[1] = this._queryParts[1].split(GraphiteMetric.MAX_DATA_POINTS_REGEX)[0];
    }

    getQuery(from: number, to: number, limit: number, offset: number): string {

      let moment_format = 'h:mm:ss_YYYYMMDD';
      let from_date = moment(from).format(moment_format);
      let to_date = moment(to).format(moment_format);


      let timeClause = `&from=${from_date}&until=${to_date}`;
      return `/?${this._queryParts[0]}${timeClause}&${this._queryParts[1]}&maxDataPoints=${limit}`;
    }
}
