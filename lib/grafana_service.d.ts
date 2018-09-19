import { Metric } from './metrics';
/**
 * @param metric to query to Grafana
 * @returns { values: [time, value][], columns: string[] }
 */
export declare function queryByMetric(metric: Metric, panelUrl: string, from: number, to: number, apiKey: string): Promise<{
    values: [number, number][];
    columns: string[];
}>;
