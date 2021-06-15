import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectTextsDialogComponent } from '../experiment/select-texts-dialog/select-texts-dialog.component';
import { IModelSettings } from '../models/IModelSettings';
import { DataService } from '../services/data.service';
import { TextsService } from '../services/texts.service';
import { TrainService } from '../services/train.service';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css'],
})
export class TrainModelComponent implements OnInit {
  constructor(
    public textsService: TextsService,
    public dialog: MatDialog,
    private trainService: TrainService,
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router
  ) {}
  trainSettings: IModelSettings;
  firstFormGroup: FormGroup;
  ngOnInit(): void {
    this.trainSettings = {
      classLable1: 'Class 1',
      classLable2: 'Class 2',
      modelName: 'Model 1',
      modelTrainingSequenceLen: 140,
      modelLearningRate: 0.0001,
      modelBatchSize: 16,
      modelEpochs: 10,
      trainClass1: [],
      trainClass2: [],
    };
    this.firstFormGroup = this.formBuilder.group({
      classLable1: ['Class 1', Validators.required],
      classLable2: ['Class 2', Validators.required],
      modelName: ['Model 1', Validators.required],
      modelTrainingSequenceLen: [140, Validators.required],
      modelLearningRate: [0.001, Validators.required],
      modelBatchSize: [50, Validators.required],
      modelEpochs: [10, Validators.required],
    });
  }
  trainValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        this.textsService.selectedModel === '' ||
        !this.textsService.selectedModel
      ) {
        return { moSelectedModel: true };
      }
      return null;
    };
  }

  trainModel() {
    this.trainSettings.classLable1 =
      this.firstFormGroup.get('classLable1').value;
    this.trainSettings.classLable2 =
      this.firstFormGroup.get('classLable2').value;

    this.trainSettings.modelBatchSize =
      this.firstFormGroup.get('modelBatchSize').value;

    this.trainSettings.modelEpochs =
      this.firstFormGroup.get('modelEpochs').value;

    this.trainSettings.modelLearningRate =
      this.firstFormGroup.get('modelLearningRate').value;

    this.trainSettings.modelName = this.firstFormGroup.get('modelName').value;

    this.trainSettings.modelTrainingSequenceLen = this.firstFormGroup.get(
      'modelTrainingSequenceLen'
    ).value;

    this.trainSettings.trainClass1 = this.textsService.clss1TrainBooks
      .filter((book) => book.level === 2)
      .map((book) => book.name);
    this.trainSettings.trainClass2 = this.textsService.clss2TrainBooks
      .filter((book) => book.level === 2)
      .map((book) => book.name);
    console.log('this.trainSettings', this.trainSettings);

    this.trainService.trainModel(this.trainSettings).subscribe((res) => {
      this.toastrService.success('The Model created Successfully', 'Success');
      this.router.navigateByUrl('/');
    });
  }
  openSelectTextsDialog(trainOrTest: string, classNum?: number) {
    const dialogRef = this.dialog.open(SelectTextsDialogComponent, {
      minWidth: '400px',
      minHeight: '300px',
    });
    if (trainOrTest === 'train') {
      dialogRef.componentInstance.mode = trainOrTest;
      dialogRef.componentInstance.classNum = classNum;
    }

    dialogRef.afterClosed().subscribe((result) => {
      console.log('trainBooks', JSON.stringify(this.textsService.trainBooks));
      console.log('testBooks', JSON.stringify(this.textsService.testBooks));
    });
  }
}
