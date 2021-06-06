import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookFlatNode } from '../models/Book';

@Injectable({
  providedIn: 'root',
})
export class TextsServiceService {
  trainLoaded: boolean;
  testLoaded: boolean;
  trainBooks: BookFlatNode[];
  testBooks: BookFlatNode[];

  constructor(private http: HttpClient) {}

  getPreTrainModels() {
    return this.http.get<{ models: string[] }>('http://localhost:5000/models');
  }
}
