# THIS PROJECT IS A PART OF [CorpGlory/tsdb-kit](https://github.com/CorpGlory/tsdb-kit) NOW

# grafana-datasource-kit

[![Build Status](https://travis-ci.org/CorpGlory/grafana-datasource-kit.svg?branch=master)](https://travis-ci.org/CorpGlory/grafana-datasource-kit)

Node.js library and utilities for running Grafana datasources on backend.
You can send your datasource metrics from Grafana to compile it on Node.js and query your datasource via Grafana API in background.

User gets a unified interface to all datasources. Library gives single output format: fields order, time units, etc

## Supported datasources

* Influxdb
* Graphite
* Prometheus
* PostgreSQL / TimescaleDB
* ElasticSearch

Please write us at ping@corpglory.com if you want your datasource to be supported: 

## Projects based on library
* [grafana-data-exporter](https://github.com/CorpGlory/grafana-data-exporter)
* [Hastic](https://github.com/hastic/hastic-server)
