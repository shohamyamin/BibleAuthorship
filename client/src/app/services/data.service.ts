import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IGraph } from '../models/IGraph';
import { TextsServiceService } from './texts-service.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private textsServiceService: TextsServiceService
  ) {}

  // getBible() {
  //   return this.http.post(
  //     'https://tiberias.dicta.org.il/server/DictaDatabaseServer/api/TextFeatures/GetTextLargeAndSmall',
  //     [
  //       '/Dicta Corpus/Tanakh/Torah',
  //       '/Dicta Corpus/Tanakh/Prophets',
  //       '/Dicta Corpus/Tanakh/Writings',
  //     ]
  //   );
  // }
  getResultDataForGraph() {
    return this.http.get<IGraph>('../assets/graphData.json').pipe(
      map((data) => {
        return data;
      })
    );
  }
}
