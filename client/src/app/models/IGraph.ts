import { IGraphData } from './IGraphData';

export interface IGraph {
  scheme: { domain: string[] };
  results: IGraphData[];
  view: any[];
  gradient: boolean;
  xAxis: boolean;
  yAxis: boolean;
  legend: boolean;
  showXAxisLabel: boolean;

  showYAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
}
