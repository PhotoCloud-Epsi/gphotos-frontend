import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.config.uploadUrl, formData);
  }
}
