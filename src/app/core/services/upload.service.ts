import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(image: string, filename: string): Observable<any> {
    return this.http.post(
        `${this.baseUrl}/upload-image`, {
      image,
      filename
    });
  }
}