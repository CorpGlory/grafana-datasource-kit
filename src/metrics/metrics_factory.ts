import { InfluxdbMetric } from './influxdb_metric';
import { GraphiteMetric } from './graphite_metric';
import { AbstractMetric, Datasource, MetricId } from './metric';
import { PrometheusMetric } from './prometheus_metric';
import { PostgresMetric } from './postgres_metric';

export function metricFactory(
  datasource: Datasource,
  targets: any[],
  id?: MetricId
): AbstractMetric {

  let class_map = {
    'influxdb': InfluxdbMetric,
    'graphite': GraphiteMetric,
    'prometheus': PrometheusMetric,
    'postgres': PostgresMetric
  };
  if(class_map[datasource.type] === undefined) {
    throw new Error(`Datasources of type ${datasource.type} are not supported currently`);
  } else {
    return new class_map[datasource.type](datasource, targets, id);
  }
}

export class Metric {
  datasource: Datasource;
  targets: any[];
  id?: MetricId;
  private _metricQuery: AbstractMetric = undefined;

  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    if(datasource === undefined) {
      throw new Error('datasource is undefined');
    }
    if(targets === undefined) {
      throw new Error('targets is undefined');
    }
    if(targets.length === 0) {
      throw new Error('targets is empty');
    }
    this.datasource = datasource;
    this.targets = targets;
    this.id = id;
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
    return new this(
      obj.datasource,
      obj.targets,
      obj._id
    );
  }
}
