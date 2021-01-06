import { IGraphData } from './IGraphData';

export interface IGraph {
  scheme: string[];
  results: IGraphData[];
  view: any[];
  gradient: boolean;
  xAxis: boolean;
  yAxis: boolean;
  legend: true;
  showXAxisLabel: boolean;

  showYAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
}
