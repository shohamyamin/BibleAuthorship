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
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public textsServiceService: TextsServiceService
  ) {}
  trainFormGroup: FormGroup;
  testFormGroup: FormGroup;
  trainLoaded: boolean;
  testLoaded: boolean;
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
      this.trainLoaded = this.textsServiceService.trainLoaded;
      this.testLoaded = this.textsServiceService.testLoaded;
    });
  }
}
