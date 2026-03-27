import { UploadResult } from './../../core/models/upload.models';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../core/services/upload.service';

type FeedbackType = 'success' | 'error' | null;

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./upload.component.html`,
  styleUrl : `./upload.component.scss`
})
export class UploadComponent {
  selectedFile = signal<File | null>(null);
  previewUrl   = signal<string | null>(null);
  isDragging   = signal(false);
  isLoading    = signal(false);
  progress     = signal(0);
  uploaded     = signal(false);
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
    if (!file.type.includes('jpeg') && !file.type.includes('jpg') && !file.type.includes('png')) {
      this.setFeedback('Seuls les fichiers JPEG/JPG/PNG sont autorisés', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.setFeedback('Fichier trop volumineux (max 5MB)', 'error');
      return;
    }

    this.selectedFile.set(file);
    this.uploaded.set(false);
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
    this.uploaded.set(false);
  }

  async upload() {
    const file = this.selectedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.progress.set(0);
    this.feedback.set({ message: '', type: null });

    try {
      const base64 = await this.toBase64(file);
      const cleanBase64 = base64.split(',')[1];

      this.progress.set(30);

      this.uploadService.uploadImage(cleanBase64, file.name).subscribe({
        next: (res: UploadResult) => {
          this.progress.set(100);

          this.setFeedback(
            'Image envoyée avec succès ✔',
            'success'
          );

          this.uploaded.set(true);
          this.isLoading.set(false);

          console.log('URL:', res.url);
        },
        error: () => {
          this.setFeedback('Erreur upload', 'error');
          this.isLoading.set(false);
        }
      });

    } catch {
      this.setFeedback('Erreur conversion image', 'error');
      this.isLoading.set(false);
    }
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  formatSize(b: number) {
    return (b / 1024).toFixed(1) + ' Ko';
  }

  private setFeedback(message: string, type: FeedbackType) {
    this.feedback.set({ message, type });
  }
}