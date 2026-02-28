import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetService } from '../../../core/services/asset-service';

@Component({
  standalone: true,
  selector: 'app-prediction',
  imports: [CommonModule, RouterModule],
  templateUrl: './prediction.html'
})
export class PredictionComponent implements OnInit {

  predictions: any[] = [];

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.assetService.forecast().subscribe(data => {
      this.predictions = data;
    });
  }
}