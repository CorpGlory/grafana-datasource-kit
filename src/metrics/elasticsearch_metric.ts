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
    let aggrgAgg = _.keys(aggrgs)[0];
    let responseValues = aggrgs[aggrgAgg].buckets;
    let agg = '3'; //test

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

