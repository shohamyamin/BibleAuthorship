import { Component, Input, OnInit } from '@angular/core';
import { IGraph } from '../models/IGraph';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-result-graph',
  templateUrl: './result-graph.component.html',
  styleUrls: ['./result-graph.component.css'],
})
export class ResultGraphComponent implements OnInit {
  constructor(private dataService: DataService) {}

  @Input()
  testBooks: string[];
  @Input()
  trainBooks: string[];
  graph: IGraph;
  dataLoaded: boolean;
  ngOnInit(): void {
    this.dataLoaded = false;
    this.dataService.getResultDataForGraph().subscribe((data) => {
      console.log('returned data', data);

      this.graph = data;
      this.dataLoaded = true;
    });
  }

  onSelect(event) {
    console.log(event);
  }
}
