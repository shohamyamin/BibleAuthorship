import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { ExperimentComponent } from './experiment/experiment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainModelComponent } from './train-model/train-model.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'experiment', component: ExperimentComponent },
  { path: 'trainModal', component: TrainModelComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  exports: [RouterModule, MatDialogModule],
})
export class AppRoutingModule {}
