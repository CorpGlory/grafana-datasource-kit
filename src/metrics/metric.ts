export declare type GrafanaDatasource = {
  url: string;
  type: string;
  params: {
      db: string;
      q: string;
      epoch: string;
  };
};

export type GrafanaMetricId = string;

export abstract class Metric {

protected datasource: GrafanaDatasource;
protected targets: any[];
protected id?: GrafanaMetricId;

constructor(datasource: GrafanaDatasource, targets: any[], id?: GrafanaMetricId) {}

abstract getQuery(from: number, to: number, limit: number, offset: number): string;


//private _metricQuery: MetricQuery = undefined;

//public get metricQuery() {
//  if(this._metricQuery === undefined) {
//    this._metricQuery = new MetricQuery(this);
//  }
//  return this._metricQuery;
//}

}