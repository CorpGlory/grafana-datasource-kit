import { ElasticsearchMetric } from '../src/metrics/elasticsearch_metric';
import { MetricQuery, Datasource } from '../src/metrics/metric';

import 'jest';
import * as _ from 'lodash';

describe('simple query', function(){

  let datasourse: Datasource = {
    url: "api/datasources/proxy/1/_msearch",
    data: [{
      "search_type": "query_then_fetch",
      "ignore_unavailable": true,
      "index": "metricbeat-*"
    },
    {
      "size": 0,
      "query": {
        "bool": {
          "filter": [
            {
              "range": {
                "@timestamp": {
                  "gte": "1545933121101",
                  "lte": "1545954721101",
                  "format": "epoch_millis"
                }
              }
            },
            {
              "query_string": {
                "analyze_wildcard": true,
                "query": "beat.hostname:opt-project.ru AND !system.network.name:\"IBM USB Remote NDIS Network Device\""
              }
            }
          ]
        }
      },
      "aggs": {
        "2": {
          "date_histogram": {
            "interval": "30s",
            "field": "@timestamp",
            "min_doc_count": 0,
            "extended_bounds": {
              "min": "1545933121101",
              "max": "1545954721101"
            },
            "format": "epoch_millis"
          },
          "aggs": {
            "1": {
              "avg": {
                "field": "system.network.in.bytes"
              }
            },
            "3": {
              "derivative": {
                "buckets_path": "1"
              }
            }
          }
        }
      }
    }],
    type: "elasticsearch"
  };
  datasourse.data = datasourse.data.map(d => JSON.stringify(d)).join('\n');

  let targets = [
    {
      "bucketAggs": [
        {
          "field": "@timestamp",
          "id": "2",
          "settings": {
            "interval": "auto",
            "min_doc_count": 0,
            "trimEdges": 0
          },
          "type": "date_histogram"
        }
      ],
      "metrics": [
        {
          "field": "system.network.in.bytes",
          "hide": true,
          "id": "1",
          "meta": {},
          "pipelineAgg": "select metric",
          "settings": {},
          "type": "avg"
        },
        {
          "field": "1",
          "id": "3",
          "meta": {},
          "pipelineAgg": "1",
          "settings": {},
          "type": "derivative"
        }
      ],
      "query": "beat.hostname:opt-project.ru AND !system.network.name:\"IBM USB Remote NDIS Network Device\"",
      "refId": "A",
      "target": "carbon.agents.0b0226864dc8-a.cpuUsage",
      "timeField": "@timestamp"
    }
  ];

  let queryTemplate = [{
    "search_type": "query_then_fetch",
    "ignore_unavailable": true,
    "index": "metricbeat-*"
  },
  {
    "size": 0,
    "query": {
      "bool": {
        "filter": [
          {
            "range": {
              "@timestamp": {
                "gte": "0",
                "lte": "1",
                "format": "epoch_millis"
              }
            }
          },
          {
            "query_string": {
              "analyze_wildcard": true,
              "query": "beat.hostname:opt-project.ru AND !system.network.name:\"IBM USB Remote NDIS Network Device\""
            }
          }
        ]
      }
    },
    "aggs": {
      "2": {
        "date_histogram": {
          "interval": "30s",
          "field": "@timestamp",
          "min_doc_count": 0,
          "extended_bounds": {
            "min": "1545933121101",
            "max": "1545954721101"
          },
          "format": "epoch_millis"
        },
        "aggs": {
          "1": {
            "avg": {
              "field": "system.network.in.bytes"
            }
          },
          "3": {
            "derivative": {
              "buckets_path": "1"
            }
          }
        }
      }
    }
  }];

  let expectedQuery = {
    url: datasourse.url,
    method: 'POST',
    schema: {
      data: queryTemplate.map(e => JSON.stringify(e)).join('\n')
    }
  };

  let elasticMetric = new ElasticsearchMetric(datasourse, targets);

  it('check correct time processing', function() {
    let from = 0;
    let to = 1;
    let limit = 222;
    let offset = 333;
    expect(elasticMetric.getQuery(from, to, limit, offset)).toEqual(expectedQuery);
  });
});
