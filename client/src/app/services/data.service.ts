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

  getResultDataForGraph() {
    return this.http.get<IGraph>('../assets/graphData.json').pipe(
      map((data) => {
        return data;
      })
    );
  }
}
