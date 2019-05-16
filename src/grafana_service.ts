import { Metric } from './metrics/metrics_factory';
import { MetricQuery } from './metrics/metric';

import { URL } from 'url';
import axios from 'axios';
import * as _ from 'lodash';


export class GrafanaUnavailable extends Error {};
export class DatasourceUnavailable extends Error {
  public url: string;
};

const CHUNK_SIZE = 50000;


/**
 * @param metric to query to Grafana
 * @returns { values: [time, value][], columns: string[] }
 */
export async function queryByMetric(
  metric: Metric, url: string, from: number, to: number, apiKey: string
): Promise<{ values: [number, number][], columns: string[] }> {

  const grafanaUrl = getGrafanaUrl(url);

  let data = {
    values: [],
    columns: []
  };

  while(true) {
    let query = metric.metricQuery.getQuery(from, to, CHUNK_SIZE, data.values.length);
    query.url = `${grafanaUrl}/${query.url}`;
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
    const msg = `Data kit: got response ${e.response.status}: ${e.message}. config: ${e.config}`;
    console.error(msg);
    if(e.request !== undefined) {
      console.error(`Data kit: request: ${e.request}`);
    }
    if(e.errno === 'ECONNREFUSED') {
      throw new GrafanaUnavailable(e.message);
    }
    if(e.response !== undefined) {
      console.log(`Data kit: \
        status: ${e.response.status}, \
        response data: ${e.response.data}, \
        headers: ${e.response.headers}
      `);
      if(e.response.status === 401) {
        throw new Error(`Unauthorized. Check the API_KEY. ${e.message}`);
      }
      if(e.response.status === 502) {
        console.error(msg);
        let datasourceError = new DatasourceUnavailable(`datasource ${query.url} unavailable, message: ${e.message}`);
        datasourceError.url = query.url;
        throw datasourceError;
      }
    }
    throw new Error(msg);
  }

  return res;
}

function getGrafanaUrl(url: string) {
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname;
  const panelUrl = path.match(/^\/*([^\/]*)\/d\//);
  if(panelUrl === null) {
    return url;
  }

  const origin = parsedUrl.origin;
  const grafanaSubPath = panelUrl[1];
  if(grafanaSubPath.length > 0) {
    return `${origin}/${grafanaSubPath}`;
  }

  return origin;
}
