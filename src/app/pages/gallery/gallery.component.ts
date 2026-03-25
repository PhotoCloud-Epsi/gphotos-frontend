import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../core/services/gallery.service';

@Component({
  standalone: true,
  selector: 'app-gallery',
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Galerie</h1>
    <input [(ngModel)]="query">
    <button (click)="search()">Search</button>
    <div *ngFor="let img of results">
      <img [src]="img.url" width="200">
    </div>
  `
})
export class GalleryComponent {
  query = '';
  results: any[] = [];

  constructor(private galleryService: GalleryService) {}

  search() {
    this.galleryService.search(this.query).subscribe((res: any) => {
      this.results = res;
    });
  }
}
