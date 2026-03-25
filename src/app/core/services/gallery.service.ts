import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, catchError, map } from 'rxjs';
import { ConfigService } from './config.service';
import { Photo, SearchResult } from '../models/photo.model';

@Injectable({ providedIn: 'root' })
export class GalleryService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  search(query: string): Observable<SearchResult> {
    const params = new HttpParams().set('q', query.trim());

    return this.http.get<Photo[]>(this.config.consultationUrl, { params }).pipe(
      map((photos: Photo[]) => ({
        photos,
        query,
        count: photos.length,
      })),
      catchError(err => throwError(() => new Error(
        err.error?.error ?? `Erreur HTTP ${err.status}`
      )))
    );
  }

  parseTags(tagsStr: string): string[] {
    return tagsStr
      ? tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];
  }
}