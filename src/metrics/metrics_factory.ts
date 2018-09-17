import { InfluxdbMetric } from './influxdb_metric'
import { GraphiteMetric } from './graphite_metric'
import { Metric, GrafanaDatasource, GrafanaMetricId } from './metric'

export function metricFactory(
  datasource: GrafanaDatasource,
  targets: any[],
  id?: GrafanaMetricId
  ): Metric {  

    let class_map = {
      'influxdb': InfluxdbMetric,
      'graphite': GraphiteMetric
    }

  return new class_map[datasource.type](datasource, targets)
}

export class GrafanaMetric {
  datasource: GrafanaDatasource;
  targets: any[];
  id?: GrafanaMetricId;
  private _metricQuery: Metric = undefined;

  constructor(datasource: GrafanaDatasource, targets: any[], id?: GrafanaMetricId) {
    if(datasource === undefined) {
      throw new Error('datasource is undefined');
    }
    if(targets === undefined) {
      throw new Error('targets is undefined');
    }
    if(targets.length === 0) {
      throw new Error('targets is empty');
    }
  }

  public get metricQuery() {
    if(this._metricQuery === undefined) {
      this._metricQuery = metricFactory(this.datasource, this.targets, this.id);
    }
    return this._metricQuery;
  }


  public toObject() {
    return {
      datasource: this.datasource,
      targets: this.targets,
      _id: this.id
    };
  }

  static fromObject(obj: any): Metric {
    if(obj === undefined) {
      throw new Error('obj is undefined');
    }
    return metricFactory(
      obj.datasource,
      obj.targets,
      obj._id
    );
  }
}