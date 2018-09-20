import { Datasource, Metric } from '../src/index';

describe('Correct InfluxDB query', function() {
  let datasource: Datasource = {
    url: 'url',
    type: 'influxdb',
    params: {
      db: 'db',
      q: '',
      epoch: ''
    }
  }

  let target = 'mean("value")'
  let query = new Metric(datasource, [target])

  it("test", function() {
      expect(query.metricQuery.getQuery(1534809600,1537488000,100,20)).toBe(
        `SELECT mean("value") FROM "db" WHERE time > '2018-08-21T00:00:00' and time <= '2018-09-21T00:00:00' \\
          LIMIT 100 OFFSET 20`
        )
  })
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
  }

  let target = `target=template(hosts.$hostname.cpu, hostname="worker1")`
  let query = new Metric(datasource, [target])

  it("test simple query with time clause", function () {
    expect(query.metricQuery.getQuery(1534809600, 1537488000, 500, 0)).toBe(
      `?target=template(hosts.$hostname.cpu, hostname="worker1")&from=00:00_20180821&until=00:00_20180921&maxDataPoints=500`
      )
  })
})
