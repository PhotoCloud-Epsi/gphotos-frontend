import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { PhotosResponse, TagsResponse } from '../models/consulation.models'

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getTags(): Observable<TagsResponse> {
    return this.http.get<TagsResponse>(
      `${this.baseUrl}/consultation/tags`
    )
  }

  getPhotos(query?: string): Observable<PhotosResponse> {
    return this.http.get<PhotosResponse>(
      `${this.baseUrl}/consultation/consultation`,
      {
        params: query ? { q: query } : {}
      }
    )
  }
}