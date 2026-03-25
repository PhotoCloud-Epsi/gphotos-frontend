import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../core/services/upload.service';

@Component({
  standalone: true,
  selector: 'app-upload',
  imports: [CommonModule],
  template: `
    <h1>Upload</h1>
    <input type="file" (change)="onFile($event)">
    <button (click)="upload()">Envoyer</button>
  `
})
export class UploadComponent {
  file!: File;

  constructor(private uploadService: UploadService) {}

  onFile(e: any) {
    this.file = e.target.files[0];
  }

  upload() {
    this.uploadService.upload(this.file).subscribe();
  }
}
