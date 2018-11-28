export declare type Datasource = {
  url: string;
  type: string;
  params: {
    db: string;
    q: string;
    epoch: string;
  };
  data?: {
    queries
  }
};

export type MetricQuery = {
  url: string;
  method: string;
  schema: any;
}

export type MetricId = string;

export abstract class AbstractMetric {

  constructor(
    public datasource: Datasource,
    public targets: any[],
    public id?: MetricId
  ) {};

  abstract getQuery(from: number, to: number, limit: number, offset: number): MetricQuery;
  abstract getResults(res);

}
