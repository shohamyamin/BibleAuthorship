import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectTextsDialogComponent } from '../experiment/select-texts-dialog/select-texts-dialog.component';
import { TextsServiceService } from '../services/texts-service.service';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css'],
})
export class TrainModelComponent implements OnInit {
  constructor(
    private textsServiceService: TextsServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}
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
    });
  }
}
