import { AbstractMetric, Datasource, MetricId, MetricQuery, MetricResults  } from './metric';

import * as _ from 'lodash';


export class ElasticsearchMetric extends AbstractMetric {
  constructor(datasource: Datasource, targets: any[], id?: MetricId) {
    super(datasource, targets, id);
  }

  getQuery(from: number, to: number, limit: number, offset: number): MetricQuery {
    return {
      url: this.datasource.url,
      method: 'POST',
      schema: {
        data: this.datasource.data
      }
    }
  }  

  getResults(res): MetricResults {
    let emptyResult = {
      columns: ['timestamp', 'target'],
      values: []
    };

    if(res.data === undefined || res.data.responses.length < 1) {
      console.log('datasource return empty response, no data');
      return emptyResult;
    }

    let aggrgs = res.data.responses[0].aggregations;
    let aggrgAgg = this.targets[0].bucketAggs.filter(a => !a.fake)[0].id;
    let responseValues = aggrgs[aggrgAgg].buckets;
    let agg = this.targets[0].metrics.filter(m => !m.hide).map(m => m.id);

    if(agg.length > 1) {
      throw Error(`multiple series for metric are not supported currently: ${JSON.stringify(agg)}`);
    }

    agg = agg[0];

    try {
      return {
        columns: ['timestamp', 'target'],
        values: responseValues.map(r => [r.key, _.has(r, agg)? r[agg].value: null])
      };
    } catch(e) {
      console.error(`Got error while parsing result: ${e.message}`);
      throw e;
    }
  }
}

