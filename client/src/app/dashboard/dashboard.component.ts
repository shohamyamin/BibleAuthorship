import { Component, Injectable, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @Injectable()
  headline: string;
  constructor() {}

  ngOnInit(): void {}
}
