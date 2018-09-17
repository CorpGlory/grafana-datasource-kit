import { GrafanaMetric } from './grafana_metric_model';
/**
 * @param metric to query to Grafana
 * @returns { values: [time, value][], columns: string[] }
 */
export declare function queryByMetric(metric: GrafanaMetric, panelUrl: string, from: number, to: number, apiKey: string): Promise<{
    values: [number, number][];
    columns: string[];
}>;
