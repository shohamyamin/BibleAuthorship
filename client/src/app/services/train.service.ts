import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IModelSettings } from '../models/IModelSettings';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  trainModel(trainSettings: IModelSettings) {
    return this.http.post<string>(
      'http://localhost:5000/api/train',
      trainSettings
    );
  }

  constructor(private http: HttpClient) {}
}
