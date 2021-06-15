import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Book, BookFlatNode } from '../models/Book';
import { IGraph } from '../models/IGraph';
import { DataService } from '../services/data.service';
import { TextsService } from '../services/texts.service';

@Component({
  selector: 'app-result-graph',
  templateUrl: './result-graph.component.html',
  styleUrls: ['./result-graph.component.css'],
})
export class ResultGraphComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private textsService: TextsService
  ) {}

  @Input()
  testBooks: BookFlatNode[];
  @Input()
  trainBooks: BookFlatNode[];
  @Input()
  graph: IGraph;
  @Input()
  dataLoaded: boolean;
  @Input()
  selectedModel: string;
  ngOnInit(): void {
    // this.dataLoaded = false;
    // let testBooksNames;
    // testBooksNames = this.testBooks
    //   .filter((book) => {
    //     return book.level == 2;
    //   })
    //   .map((book) => book.name);
    // console.log('send Data', testBooksNames, this.selectedModel);
    // this.dataService
    //   .getResultDataForGraph(testBooksNames, this.selectedModel)
    //   .subscribe((data) => {
    //     console.log('returned data', data);
    //     this.graph = data;
    //     this.dataLoaded = true;
    //   });
  }
  onSelect(event) {
    console.log(event);
  }
}
