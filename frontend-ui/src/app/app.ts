import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { Asset } from './models';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  assets: Asset[] = [];
  selectedFile: File | null = null;
  editingAsset: Asset | null = null;
  editingId: number | null = null;
  editableAsset: Asset | null = null;
  selectedFileName: string | null = null;
  trackById(index: number, asset: Asset): number {
    return asset.id;
  }

  constructor(private api: ApiService) {}

  loadAssets() {
    this.api.getAssets().subscribe({
      next: (data) => {
        console.log("API Response:", data);
        this.assets = data;
      },
      error: (err) => {
        console.error("Error:", err);
      }
    });
  } 

 onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFileName = file.name;
  }
}

  uploadCsv() {
    if (!this.selectedFile) return;

    this.api.uploadCsv(this.selectedFile).subscribe(() => {
      this.loadAssets();
      this.selectedFile = null;
    });
  }

  deleteAsset(id: number) {
    if (!confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    this.api.deleteAsset(id).subscribe({
      next: () => {
        // Remove from frontend array
        this.assets = this.assets.filter(asset => asset.id !== id);
      },
      error: (err) => {
        console.error('Delete failed', err);
      }
    });
  }

  editAsset(asset: Asset) {
    this.editingId = asset.id;

    // Clone the object so we don’t edit original directly
    this.editableAsset = { ...asset };
  }

 saveUpdate() {
  if (!this.editingAsset) return;

  this.api.updateAsset(this.editingAsset.id, this.editingAsset)
    .subscribe(updated => {

      // Find index in array
      const index = this.assets.findIndex(a => a.id === updated.id);

      if (index !== -1) {
        this.assets[index] = updated; // Update locally
      }

      this.editingAsset = null; // Close edit box
    });
  }

  saveInlineUpdate() {
    if (!this.editableAsset) return;

    this.api.updateAsset(this.editableAsset.id, this.editableAsset)
      .subscribe((updated: Asset) => {

        const index = this.assets.findIndex(a => a.id === updated.id);

        if (index !== -1) {
          this.assets[index] = updated;
        }

        this.editingId = null;
        this.editableAsset = null;
      });
  }

  cancelEdit() {
    this.editingId = null;
    this.editableAsset = null;
  }
}