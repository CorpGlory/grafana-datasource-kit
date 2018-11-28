import { Metric } from './metrics/metrics_factory';

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

  let datasource = metric.datasource;
  let type = datasource.type;
  let origin = new URL(panelUrl).origin;
  let url = `${origin}/${datasource.url}`;

  let params = datasource.params;
  let data = {
    values: [],
    columns: []
  };

  while(true) {
    let query = metric.metricQuery.getQuery(from, to, CHUNK_SIZE, data.values.length);
    let res;

    if(type === 'influxdb') {
      let chunkParams = Object.assign({}, params);
      chunkParams.q = query;
      res = await queryGrafana({url, params: chunkParams}, apiKey);
    } else if(type === 'graphite') {
      res = await queryGrafana({url: `${url}/${query}`, params}, apiKey);
    } else if(type === 'prometheus') {
      res = await queryGrafana({url, params}, apiKey);
    } else if(type === 'postgres') {
      console.log(query);
      res = await queryGrafana({url, data: query}, apiKey, 'POST');
    } else {
      throw Error(`${type} isn't supported`);
    }

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

async function queryGrafana(params: {}, apiKey: string, method='GET') {
  let headers = { Authorization: `Bearer ${apiKey}` };
  let query = {
    method,
    headers
  };

  _.forOwn(params, (val,key) => {
    query[key] = val;
  });

  try {
    var res = await axios(query);
    console.log(res.data);
  } catch (e) {
    console.log(`Data kit: got response ${e.response.status}, message: ${e.message}`);
    if(e.response.status === 401) {
      throw new Error('Unauthorized. Check the API_KEY.');
    }
    throw new Error(e.message);
  }

  return res;
}
