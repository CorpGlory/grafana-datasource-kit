import { GrafanaMetric } from './metrics';

import { URL } from 'url';
import axios from 'axios';


const CHUNK_SIZE = 50000;


/**
 * @param metric to query to Grafana
 * @returns { values: [time, value][], columns: string[] }
 */
export async function queryByMetric(
  metric: GrafanaMetric, panelUrl: string, from: number, to: number, apiKey: string
): Promise<{ values: [number, number][], columns: string[] }> {

  let datasource = metric.datasource;
  let origin = new URL(panelUrl).origin;
  let url = `${origin}/${datasource.url}`;

  let params = datasource.params;
  let data = {
    values: [],
    columns: []
  };

  let chunkParams = Object.assign({}, params);
  while(true) {
    chunkParams.q = metric.metricQuery.getQuery(from, to, CHUNK_SIZE, data.values.length);
    var chunk = await queryGrafana(url, apiKey, chunkParams);
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

async function queryGrafana(url: string, apiKey: string, params: any) {
  let headers = { Authorization: `Bearer ${apiKey}` };

  try {
    var res = await axios.get(url, { params, headers });
  } catch (e) {
    if(e.response.status === 401) {
      throw new Error('Unauthorized. Check the $HASTIC_API_KEY.');
    }
    throw new Error(e.message);
  }

  if (res.data.results === undefined) {
    throw new Error('results field is undefined in response.');
  }

  // TODO: support more than 1 metric (each res.data.results item is a metric)
  let results = res.data.results[0];
  if (results.series === undefined) {
    return [];
  }

  return results.series[0];
}
