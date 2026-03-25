import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ConfigService } from './config.service';

export type UploadProgress = { progress: number };
export type UploadSuccess  = { success: true; message: string };
export type UploadResult   = UploadProgress | UploadSuccess;

@Injectable({ providedIn: 'root' })
export class UploadService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  upload(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(this.config.uploadUrl, fd).pipe(
      catchError(err => throwError(() => new Error(
        err.error?.message ?? `Erreur HTTP ${err.status}`
      )))
    );
  }

  uploadWithProgress(file: File): Observable<UploadResult> {
    const fd = new FormData();
    fd.append('file', file, file.name);

    const req = new HttpRequest('POST', this.config.uploadUrl, fd, {
      reportProgress: true,
    });

    return this.http.request(req).pipe(
      map((event: HttpEvent<any>): UploadResult => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          return { progress: Math.round(100 * event.loaded / event.total) };
        }
        return { success: true, message: 'Image envoyée avec succès.' };
      }),
      catchError(err => throwError(() => new Error(
        err.error?.message ?? `Erreur HTTP ${err.status}`
      )))
    );
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    if (!file.type.match(/image\/jpe?g/)) {
      return { valid: false, error: 'Seuls les fichiers JPEG sont acceptés.' };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'Fichier trop volumineux (max 10 Mo).' };
    }
    return { valid: true };
  }
}