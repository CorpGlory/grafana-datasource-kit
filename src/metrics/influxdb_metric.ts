import { Metric, GrafanaDatasource, GrafanaMetricId } from "./metric";

export class InfluxdbMetric extends Metric{

  private static INFLUX_QUERY_TIME_REGEX = /time >[^A-Z]+/;

  private _queryParts: string[];

  constructor(datasource: GrafanaDatasource, targets: any[], id?: GrafanaMetricId) {
    super(datasource, targets, id);

    var queryStr = datasource.params.q;
    this._queryParts = queryStr.split(InfluxdbMetric.INFLUX_QUERY_TIME_REGEX);
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
}