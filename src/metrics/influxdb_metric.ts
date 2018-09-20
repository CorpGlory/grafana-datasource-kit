import { AbsractMetric, Datasource, MetricId } from "./metric";

const INFLUX_QUERY_TIME_REGEX = /time >[^A-Z]+/;

export class InfluxdbMetric extends AbsractMetric {

  private _queryParts: string[];

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);

    var queryStr = datasource.params.q;
    this._queryParts = queryStr.split(INFLUX_QUERY_TIME_REGEX);
    if(this._queryParts.length == 1) {
      throw new Error(
        `Query "${queryStr}" is not replaced with LIMIT/OFFSET oeprators. Missing time clause.`
      );
    }
    if(this._queryParts.length > 2) {
      throw new Error(`Query "${queryStr}" has multiple time clauses. Can't parse.`);
    }
  }

  getQuery(from: number, to: number, limit: number, offset: number): string {
    let timeClause = `time >= ${from}ms AND time <= ${to}ms`;
    return `${this._queryParts[0]} ${timeClause} ${this._queryParts[1]} LIMIT ${limit} OFFSET ${offset}`;
  }

  getResults(res) {
    if (res.data.results === undefined) {
      throw new Error('results field is undefined in response.');
    }

    // TODO: support more than 1 metric (each res.data.results item is a metric)
    let results = res.data.results[0];
    if (results.series === undefined) {
      return [];
    }

    return results.series[0];
  }
}
