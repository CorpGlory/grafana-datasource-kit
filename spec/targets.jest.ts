import { GrafanaMetric, GrafanaDatasource } from '../src/grafana_metric_model'

describe('Correct InfluxDB query', function() {
  let datasource: GrafanaDatasource = {
    url: 'url',
    type: 'influxdb',
    params: {
      db: 'db',
      q: 'q',
      epoch: '0-1'
    }
  }
  let query = new GrafanaMetric(datasource, [1,2])

  it("test", function() {
      expect(query.metricQuery.getQuery(0,1,2,3)).toBe('check')
  })
})
