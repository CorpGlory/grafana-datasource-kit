import { AbsractMetric, Datasource, MetricId  } from './metric';

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

      //move to seconds
      from = from / 1000;
      to = to / 1000;

      let timeClause = `&from=${from}s&until=${to}s`;
      return `${this._queryParts[0]}${timeClause}&${this._queryParts[1]}&maxDataPoints=${limit}`;
    }
}
