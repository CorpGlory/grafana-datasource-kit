export declare type Datasource = {
  url: string;
  type: string;
  params?: {
    db: string;
    q: string;
    epoch: string;
  };
  data?: any;
};

export type MetricQuery = {
  url: string;
  method: string;
  schema: any;
}

<<<<<<< HEAD
export type MetricResults = {
  values: any;
  columns: any;
}

=======
>>>>>>> 34ee46c801a0675422b6238ec8171a28807db2ce
export type MetricId = string;

export abstract class AbstractMetric {

  constructor(
    public datasource: Datasource,
    public targets: any[],
    public id?: MetricId
  ) {};

  abstract getQuery(from: number, to: number, limit: number, offset: number): MetricQuery;
<<<<<<< HEAD
  abstract getResults(res): MetricResults;
=======
  abstract getResults(res);
>>>>>>> 34ee46c801a0675422b6238ec8171a28807db2ce

}
