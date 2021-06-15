import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    private textsService: TextsService,
    public dialog: MatDialog,
    private trainService: TrainService,
    public dataService: DataService
  ) {}
  trainSettings: IModelSettings;

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
  }
  trainModel() {
    this.trainSettings.trainClass1 = this.textsService.clss1TrainBooks
      .filter((book) => book.level == 2)
      .map((book) => book.name);
    this.trainSettings.trainClass2 = this.textsService.clss2TrainBooks
      .filter((book) => book.level == 2)
      .map((book) => book.name);
    console.log('this.trainSettings', this.trainSettings);

    this.trainService.trainModel(this.trainSettings).subscribe((res) => {
      console.log('res', res);
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
