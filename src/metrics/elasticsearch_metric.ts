import { AbstractMetric, Datasource, MetricId, MetricQuery, MetricResults  } from './metric';

import * as _ from 'lodash';


export class ElasticsearchMetric extends AbstractMetric {
  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
  }

  getQuery(from: number, to: number, limit: number, offset: number): MetricQuery {
    let data = this.datasource.data.split('\n').map(d => d === '' ? d: JSON.parse(d));

    if(data.length === 0) {
      throw new Error('Datasource data is empty');
    }

    data[1].size = 0;

    let filters = data[1].query.bool.filter.filter(f => _.has(f, 'range'));
    if(filters.length === 0) {
      throw new Error('Empty filters');
    }
    let range = filters[0].range;
    range['@timestamp'].gte = from.toString();
    range['@timestamp'].lte = to.toString();
    let aggs = _.filter(data[1].aggs, f => _.has(f, 'date_histogram'));
    _.each(aggs, agg => agg.date_histogram.extended_bounds = {
      min: from.toString(),
      max: to.toString()
    });

    data = data.map(d => JSON.stringify(d)).join('\n');

    return {
      url: this.datasource.url,
      method: 'POST',
      schema: { data }
    }
  }

  getResults(res): MetricResults {
    let columns = ['timestamp', 'target'];
    let values = [];

    if(res.data === undefined || res.data.responses.length < 1) {
      console.log('datasource return empty response, no data');
      return {
        columns,
        values
      };
    }

    let aggregations = res.data.responses[0].aggregations;
    let aggrgAgg: any = this.targets[0].bucketAggs.filter(a => {
      return !a.fake && _.has(aggregations, a.id)
    });
    if(_.isEmpty(aggrgAgg)) {
      const bucketAggs = JSON.stringify(this.targets[0].bucketAggs);
      const aggregationKeys = JSON.stringify(_.keys(aggregations));
      console.error(`can't find related aggregation id. bucketAggs:${bucketAggs} aggregationKeys:${aggregationKeys}`);
      throw Error(`can't find related aggregation id`);
    } else {
      aggrgAgg = aggrgAgg[0].id;
    }
    let responseValues = aggregations[aggrgAgg].buckets;
    let agg = this.targets[0].metrics.filter(m => !m.hide).map(m => m.id);

    if(agg.length > 1) {
      throw Error(`multiple series for metric are not supported currently: ${JSON.stringify(agg)}`);
    }

    agg = agg[0];

    if(responseValues.length > 0) {
      values = responseValues.map(r => [r.key, _.has(r, agg) ? r[agg].value: null]);
    }

    return {
      columns,
      values
    }
  }
}

