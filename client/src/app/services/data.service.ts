import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { IGraph } from '../models/IGraph';
import { TextsService } from './texts.service';
import { TrainService } from './train.service';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private textsService: TextsService) {}

  graph = {
    scheme: { domain: [] },
    results: [],
    view: [700, 400],
    gradient: true,
    xAxis: true,
    yAxis: true,
    legend: true,
    showXAxisLabel: true,

    showYAxisLabel: true,
    xAxisLabel: 'Book Name',
    yAxisLabel: 'Confidence %',
  };
  classLable1: string = '';
  classLable2: string = '';

  getResultDataForGraph(testBooks: string[], selectedModel: string) {
    return this.http
      .post<string>('http://localhost:5000/api/analyze', {
        testBooks: testBooks,
        selectedModel: selectedModel,
      })
      .pipe(
        map((data) => {
          let returnedData = JSON.parse(data);
          let results = [];
          console.log('returned data', returnedData);

          for (let index = 0; index < returnedData.preds.length; index++) {
            const pred = returnedData.preds[index];
            const conf = returnedData.confs[index];
            const book = returnedData.books[index];

            this.graph.scheme.domain.push(
              returnedData.preds[index] == 0 ? '#90EE90' : '#B22222'
            );
            results.push({
              name: book,
              value: conf,
              pred: pred,
            });
          }
          this.classLable1 = returnedData.classLable1;
          this.classLable2 = returnedData.classLable2;
          this.graph.results = results;
          this.textsService.clss1TrainBooks = returnedData.trainClass1.map(
            (book) => {
              return { expandable: false, name: book, level: 2 };
            }
          );
          this.textsService.clss2TrainBooks = returnedData.trainClass2.map(
            (book) => {
              return { expandable: false, name: book, level: 2 };
            }
          );

          return this.graph;
        })
      );
  }
}
