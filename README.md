# grafana-datasource-kit

![master head status](https://travis-ci.org/CorpGlory/grafana-datasource-kit.svg?branch=master)

Node.js library for running Grafana datasources on backend plus utils.
You can send your datasource metric from Grafana to compile it on Node.js and query your datasource via Grafana API in background.

User gets unified interface, library provides same output format for each datasource, such as fields order, time units.

## Supported datasources

* Influxdb
* Graphite
* Prometheus
* PostgreSQL / TimescaleDB

Please write us a letter if you want your datasource to be supported: ping@corpglory.com 

## Projects based on library
* [grafana-data-exporter](https://github.com/CorpGlory/grafana-data-exporter)
* [Hastic](https://github.com/hastic/hastic-server)
