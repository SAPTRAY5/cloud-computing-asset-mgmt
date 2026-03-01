import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Asset } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:5225/api/Assets';

  constructor(private http: HttpClient) {}

 getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/get-all`);
  }
  uploadCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload-csv`, formData);
  }

  updateAsset(id: number, asset: Asset) {
    return this.http.put<Asset>(`${this.baseUrl}/${id}`, asset);
  }

  deleteAsset(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}