import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService, UploadResult } from '../../core/services/upload.service';

type FeedbackType = 'success' | 'error' | null;

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-header">
      <h1>Déposer une image</h1>
      <p>L'image sera analysée automatiquement et ses tags stockés en base de données.</p>
    </div>

    <div
      class="dropzone"
      [class.dropzone--dragging]="isDragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
    >
      <input type="file" accept="image/jpeg,image/jpg" (change)="onFileChange($event)" />
      <div class="dropzone__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
      </div>
      <p>Glisser-déposer une image ici</p>
      <span>ou cliquer pour sélectionner — JPEG uniquement</span>
    </div>

    @if (selectedFile()) {
      <div class="preview">
        <img [src]="previewUrl()" class="preview__img" alt="preview" />
        <div class="preview__info">
          <span class="preview__name">{{ selectedFile()!.name }}</span>
          <span class="preview__size">{{ formatSize(selectedFile()!.size) }}</span>
        </div>
        <button class="preview__remove" (click)="removeFile()" title="Retirer">&#x2715;</button>
      </div>
    }

    @if (isLoading() && progress() > 0) {
      <div class="progress-bar">
        <div class="progress-bar__fill" [style.width.%]="progress()"></div>
      </div>
    }

    <div class="upload-actions">
      <button
        class="btn btn--primary"
        [disabled]="!selectedFile() || isLoading()"
        (click)="upload()"
      >
        @if (isLoading()) {
          <span class="spinner"></span> Envoi en cours…
        } @else {
          Envoyer l'image
        }
      </button>
    </div>

    @if (feedback().type) {
      <div
        class="feedback"
        [class.feedback--success]="feedback().type === 'success'"
        [class.feedback--error]="feedback().type === 'error'"
      >
        {{ feedback().message }}
      </div>
    }
  `
})
export class UploadComponent {
  selectedFile = signal<File | null>(null);
  previewUrl   = signal<string | null>(null);
  isDragging   = signal(false);
  isLoading    = signal(false);
  progress     = signal(0);
  feedback     = signal<{ message: string; type: FeedbackType }>({ message: '', type: null });

  constructor(private uploadService: UploadService) {}

  onDragOver(e: DragEvent)  { e.preventDefault(); this.isDragging.set(true); }
  onDragLeave()             { this.isDragging.set(false); }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file);
  }

  handleFile(file: File) {
    const v = this.uploadService.validateFile(file);
    if (!v.valid) { this.setFeedback(v.error!, 'error'); return; }
    this.selectedFile.set(file);
    this.feedback.set({ message: '', type: null });
    const reader = new FileReader();
    reader.onload = e => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removeFile() {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.progress.set(0);
    this.feedback.set({ message: '', type: null });
  }

  upload() {
    const file = this.selectedFile();
    if (!file) return;
    this.isLoading.set(true);
    this.progress.set(0);
    this.feedback.set({ message: '', type: null });

    this.uploadService.uploadWithProgress(file).subscribe({
      next: (result: UploadResult) => {
        if ('progress' in result) {
          this.progress.set(result.progress);
        } else {
          this.setFeedback('Image envoyée avec succès. Elle sera analysée dans quelques secondes.', 'success');
          this.removeFile();
          this.isLoading.set(false);
        }
      },
      error: (err: Error) => {
        this.setFeedback(err.message, 'error');
        this.isLoading.set(false);
      },
    });
  }

  formatSize(b: number) { return (b / 1024).toFixed(1) + ' Ko'; }

  private setFeedback(message: string, type: FeedbackType) {
    this.feedback.set({ message, type });
  }
}
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { UploadService } from '../../core/services/upload.service';

// @Component({
//   standalone: true,
//   selector: 'app-upload',
//   imports: [CommonModule],
//   template: `
//     <h1>Upload</h1>
//     <input type="file" (change)="onFile($event)">
//     <button (click)="upload()">Envoyer</button>
//   `
// })
// export class UploadComponent {
//   file!: File;

//   constructor(private uploadService: UploadService) {}

//   onFile(e: any) {
//     this.file = e.target.files[0];
//   }

//   upload() {
//     this.uploadService.upload(this.file).subscribe();
//   }
// }
