import { Asset } from './../asset.model';
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssetService } from '../../../core/services/asset-service';

@Component({
  standalone: true,
  selector: 'app-asset-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './asset-list.html'
})
export class AssetListComponent implements OnInit {

  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  filterText = '';

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets() {
    this.assetService.getAll().subscribe(data => {
      this.assets = data;
      this.filteredAssets = data;
    });
  }

  filter() {
    const text = this.filterText.toLowerCase();
    this.filteredAssets = this.assets.filter(a =>
      a.name.toLowerCase().includes(text) ||
      a.category.toLowerCase().includes(text) ||
      a.status.toLowerCase().includes(text)
    );
  }

  update(asset: Asset) {
    this.assetService.update(asset)
      .subscribe(() => this.loadAssets());
  }

  delete(id: number) {
    this.assetService.delete(id)
      .subscribe(() => this.loadAssets());
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.assetService.uploadExcel(file)
        .subscribe(() => this.loadAssets());
    }
  }
}