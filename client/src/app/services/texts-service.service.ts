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

  constructor() {}
}
