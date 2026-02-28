import { Routes } from '@angular/router';

import { AssetListComponent } from './app/features/assets/asset-list/asset-list';
import { PredictionComponent } from './app/features/prediction/prediction/prediction';

export const routes: Routes = [
  { path: '', component: AssetListComponent },
  { path: 'prediction', component: PredictionComponent }
];