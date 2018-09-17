import { Metric, GrafanaDatasource, MetricId  } from "./metric";

export class GraphiteMetric extends Metric {

    constructor(datasource: GrafanaDatasource, targets: any[], id?: MetricId) {
      super(datasource, targets, id);
    }

    getQuery(from: number, to: number, limit: number, offset: number): string {
      return ''; //mock
    }

    public toObject() {
        return {
          datasource: this.datasource,
          targets: this.targets,
          _id: this.id
        };
      }
    
    static fromObject(obj: any): GraphiteMetric {
    if(obj === undefined) {
        throw new Error('obj is undefined');
    }
    return new GraphiteMetric(
        obj.datasource,
        obj.targets,
        obj._id
    );
    }
}