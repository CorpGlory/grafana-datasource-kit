import { Metric } from './metrics/metrics_factory';
import { MetricQuery } from './metrics/metric';

import { URL } from 'url';
import axios from 'axios';
import * as _ from 'lodash';


const CHUNK_SIZE = 50000;


/**
 * @param metric to query to Grafana
 * @returns { values: [time, value][], columns: string[] }
 */
export async function queryByMetric(
  metric: Metric, panelUrl: string, from: number, to: number, apiKey: string
): Promise<{ values: [number, number][], columns: string[] }> {

  let origin = new URL(panelUrl).origin;
  let data = {
    values: [],
    columns: []
  };

  while(true) {
    let query = metric.metricQuery.getQuery(from, to, CHUNK_SIZE, data.values.length);
    query.url = `${origin}/${query.url}`;
    let res = await queryGrafana(query, apiKey);
    let chunk = metric.metricQuery.getResults(res);
    let values = chunk.values;
    data.values = data.values.concat(values);
    data.columns = chunk.columns;

    if(values.length < CHUNK_SIZE) {
      // because if we get less that we could, then there is nothing more
      break;
    }
  }

  return data;
}

async function queryGrafana(query: MetricQuery, apiKey: string) {
  let headers = { Authorization: `Bearer ${apiKey}` };
  let axiosQuery = {
    headers,
    url: query.url,
    method: query.method,
  };

  _.defaults(axiosQuery, query.schema);

  try {
    var res = await axios(axiosQuery);
  } catch (e) {
    console.log(`Data kit: got response ${e.response.status}, message: ${e.message}`);
    if(e.response.status === 401) {
      throw new Error('Unauthorized. Check the API_KEY.');
    }
    throw new Error(e.message);
  }

  return res;
}
