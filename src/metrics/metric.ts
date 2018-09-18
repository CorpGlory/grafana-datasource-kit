export declare type Datasource = {
  url: string;
  type: string;
  params: {
      db: string;
      q: string;
      epoch: string;
  };
};

export type MetricId = string;

export abstract class AbsractMetric {

protected datasource: Datasource;
protected targets: any[];
protected id?: MetricId;

constructor(datasource: Datasource, targets: any[], id?: MetricId) {}

abstract getQuery(from: number, to: number, limit: number, offset: number): string;

}
