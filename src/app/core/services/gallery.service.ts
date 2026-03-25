import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  search(q: string) {
    const params = new HttpParams().set('q', q);
    return this.http.get(this.config.consultationUrl, { params });
  }
}
