import { PostgresMetric } from '../src/metrics/postgres_metric';
import { MetricQuery } from '../src/metrics/metric';

import 'jest';
import * as _ from 'lodash';

describe('Test query creation', function() {

  let queryPayload = {
    from: 1542983750857,
    to: 1542984313292,
    queries:[{
      refId: 'A',
      intervalMs:2000,
      maxDataPoints:191,
      datasourceId:1,
      rawSql: 'SELECT\n  \"time\" AS \"time\",\n  val\nFROM local\nORDER BY 1',
      format: 'time_series'
    }]
  };

  let datasource = {
      url: 'api/tsdb/query',
      type: 'postgres',
      data: queryPayload
  };

  let targets = [{
    refId: 'A',
  }];

  let limit = 1000;
  let offset = 0;
  let postgres = new PostgresMetric(datasource, targets);
  let mQuery: MetricQuery = postgres.getQuery(queryPayload.from, queryPayload.to, limit, offset);

  it('test that payload placed to data field', function() {
    expect('data' in mQuery.schema).toBeTruthy();
    expect('queries' in mQuery.schema.data).toBeTruthy();
    expect(mQuery.schema.data.queries).toBeInstanceOf(Array);
  });

  it('test from/to casting to string', function() {
    expect(typeof mQuery.schema.data.from).toBe('string');
    expect(typeof mQuery.schema.data.to).toBe('string');
  });

  it('method should be POST', function() {
    expect(mQuery.method.toLocaleLowerCase()).toBe('post');
  });

  let timestamps = [1542983800000, 1542983800060, 1542983800120]
  let response = {
    data: {
      results: {
        A: {
          refId: 'A',
          meta: {
            rowCount:0,
            sql: 'SELECT "time" AS "time", val FROM local ORDER BY 1'
          },
          series: [
            {
              name:"val",
              points: [
                [622, timestamps[0]],
                [844, timestamps[1]],
                [648, timestamps[2]]
              ]
            }
          ],
          tables: 'null'
        }
      }
    }
  }

  let result = postgres.getResults(response);

  it('check results columns order', function() {
    let timestampColumnNumber = result.columns.indexOf('timestamp');
    expect(result.values.map(v => v[timestampColumnNumber])).toEqual(timestamps);
  });
});
