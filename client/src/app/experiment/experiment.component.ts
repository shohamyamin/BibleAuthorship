import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectTextsDialogComponent } from './select-texts-dialog/select-texts-dialog.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { TextsServiceService } from '../services/texts-service.service';

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
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public textsServiceService: TextsServiceService
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
    if (trainOrTest === 'train') {
      dialogRef.componentInstance.mode = trainOrTest;
    }

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
