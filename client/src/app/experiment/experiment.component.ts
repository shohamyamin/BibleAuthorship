import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectTextsDialogComponent } from './select-texts-dialog/select-texts-dialog.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { TextsService } from '../services/texts.service';
import { DataService } from '../services/data.service';
import { IGraph } from '../models/IGraph';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class ExperimentComponent implements OnInit {
  analyzePressed: boolean;
  trainFormGroup: FormGroup;
  testFormGroup: FormGroup;
  trainLoaded: boolean;
  testLoaded: boolean;
  graph: IGraph;
  dataLoaded: boolean;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public textsServiceService: TextsService,
    public textsService: TextsService,
    public dataService: DataService
  ) {
    this.testLoaded = false;
  }

  ngOnInit(): void {
    this.trainLoaded = this.textsServiceService.trainLoaded;
    this.testLoaded = this.textsServiceService.testLoaded;
  }
  openSelectTextsDialog(trainOrTest: string) {
    const dialogRef = this.dialog.open(SelectTextsDialogComponent, {
      minWidth: '400px',
      minHeight: '300px',
    });

    dialogRef.componentInstance.mode = trainOrTest;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(
        'trainBooks',
        JSON.stringify(this.textsServiceService.trainBooks)
      );
      console.log(
        'testBooks',
        JSON.stringify(this.textsServiceService.testBooks)
      );
      this.trainLoaded = this.textsServiceService.trainLoaded;
      this.testLoaded = this.textsServiceService.testLoaded;
    });
  }

  analyzeBegin() {
    this.analyzePressed = true;

    let testBooksNames;
    testBooksNames = this.textsServiceService.testBooks
      .filter((book) => {
        return book.level == 2;
      })
      .map((book) => book.name);
    console.log('send Data', testBooksNames, this.textsService.selectedModel);

    this.dataService
      .getResultDataForGraph(testBooksNames, this.textsService.selectedModel)
      .subscribe((data) => {
        console.log('returned data', data);

        this.graph = data;
        this.dataLoaded = true;
      });
  }
  selectDefaultTestBooks() {
    this.textsServiceService.testBooks = [
      { name: 'Numbers', level: 2, expandable: false },
      { name: 'Deuteronomy', level: 2, expandable: false },
      { name: 'Job', level: 2, expandable: false },
      { name: 'Proverbs', level: 2, expandable: false },
      { name: 'Ecclesiastes', level: 2, expandable: false },
      { name: 'Song of Songs', level: 2, expandable: false },
    ];
    this.testLoaded = this.textsServiceService.testLoaded = true;
  }
  SelectDefaultTrainBooks() {
    this.textsServiceService.trainBooks = [
      { name: 'Genesis', level: 2, expandable: false },
      { name: 'Exodus', level: 2, expandable: false },
      { name: 'Leviticus', level: 2, expandable: false },
      { name: 'Joshua', level: 2, expandable: false },
      { name: 'Ezra', level: 2, expandable: false },
      { name: 'Nehemiah', level: 2, expandable: false },
    ];
    this.trainLoaded = this.textsServiceService.trainLoaded = true;
  }
}
