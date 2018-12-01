import { Datasource, Metric } from '../src/index';

import 'jest';

describe('Correct InfluxDB query', function() {
  let datasource: Datasource = {
    url: 'url',
    type: 'influxdb',
    params: {
      db: 'db',
      q: `SELECT mean("value") FROM "db" WHERE time > xxx AND time <= xxx LIMIT 100 OFFSET 20`,
      epoch: ''
    }
  };

  let target = 'mean("value")';

  it("test query with two time expressions", function() {
    let query = new Metric(datasource, [target]);
    expect(query.metricQuery.getQuery(1534809600,1537488000,666,10).schema.params.q).toBe(
      `SELECT mean("value") FROM "db" WHERE  time >= 1534809600ms AND time <= 1537488000ms LIMIT 666 OFFSET 10`
    )
  });

  it('test query with one time expression', function() {
    datasource.params.q = `SELECT mean("value") FROM "cpu_value" WHERE time >= now() - 6h GROUP BY time(30s) fill(null)`;
    let query = new Metric(datasource, [target]);
    expect(query.metricQuery.getQuery(1534809600,1537488000,666,10).schema.params.q).toBe(
      `SELECT mean("value") FROM "cpu_value" WHERE  time >= 1534809600ms AND time <= 1537488000ms GROUP BY time(30s) fill(null) LIMIT 666 OFFSET 10`
    )
  });

  it('test query with time expression', function() {
    datasource.params.q = `SELECT mean("value") FROM "cpu_value" WHERE time>= now() - 6h AND time<xxx GROUP BY time(30s) fill(null)`;
    let query = new Metric(datasource, [target]);
    expect(query.metricQuery.getQuery(1534809600,1537488000,666,10).schema.params.q).toBe(
      `SELECT mean("value") FROM "cpu_value" WHERE  time >= 1534809600ms AND time <= 1537488000ms GROUP BY time(30s) fill(null) LIMIT 666 OFFSET 10`
    )
  });

})

describe('correct Graphite query', function() {
  let datasource: Datasource = {
    url: 'http://example.com:1234',
    type: 'graphite',
    params: {
      db: '',
      q: '',
      epoch: ''
    }
  };

  let target = `target=template(hosts.$hostname.cpu, hostname="worker1")`;
  let query = new Metric(datasource, [target]);

  it("test simple query with time clause", function () {
    expect(query.metricQuery.getQuery(1534809600, 1537488000, 500, 0).url).toBe(
      `${datasource.url}?target=${target}&from=00:00_20180821&until=00:00_20180921&maxDataPoints=500`
    )
  });
})
