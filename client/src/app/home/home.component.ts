import { Component, OnInit } from '@angular/core';
import { HomeDataService } from '../services/home-data.service';
import { map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  val: string;
  titles: string[];
  constructor(private homeDataService: HomeDataService) {}

  ngOnInit(): void {
    this.val = 'roy';
  }

  buttonClicked() {
    this.homeDataService.getHomeData().subscribe((name) => {
      this.val = name;
    });
  }
}
