import { ApiService } from '../../core/services/.service';
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type GalleryState = 'idle' | 'loading' | 'results' | 'empty' | 'error';

type Photo = {
  id: number;
  url: string;
  tags: string;
  created_at: string;
};

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {

  query        = '';
  lastQuery    = signal('');
  state        = signal<GalleryState>('idle');
  photos       = signal<Photo[]>([]);
  errorMessage = signal('');
  activeFilter = signal<string | null>(null);
  sortBy       = signal<'default' | 'tags'>('default');
  selectedPhoto = signal<Photo | null>(null);

  suggestedTags: string[] = [];
  previewPhotos: Photo[] = [];
  skeletons = Array(6);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadTags();
    this.loadPreview();
  }

  // 🔥 Charger les tags depuis API
  loadTags() {
    this.api.getTags().subscribe({
      next: res => {
        this.suggestedTags = res.tags;
      },
      error: () => {
        this.suggestedTags = [];
      }
    });
  }

  // 🔥 Charger preview (sans query)
  loadPreview() {
    this.api.getPhotos().subscribe({
      next: res => {
        this.previewPhotos = res.photos;
      },
      error: () => {
        this.previewPhotos = [];
      }
    });
  }

  sortedPhotos = computed(() => {
    const list = [...this.photos()];
    if (this.sortBy() === 'tags') {
      list.sort((a, b) => a.tags.localeCompare(b.tags));
    }
    return list;
  });

  search() {
    const q = this.query.trim();
    if (!q) return;

    this.activeFilter.set(null);
    this._doSearch(q);
  }

  applyFilter(tag: string) {
    this.query = tag;
    this.activeFilter.set(tag);
    this._doSearch(tag);
  }

  onQueryInput() {
    if (!this.query.trim()) this.activeFilter.set(null);
  }

  clearSearch() {
    this.query = '';
    this.activeFilter.set(null);
    this.state.set('idle');
    this.photos.set([]);
    this.lastQuery.set('');
  }

  setSortBy(v: 'default' | 'tags') {
    this.sortBy.set(v);
  }

  openPhoto(p: Photo) {
    this.selectedPhoto.set(p);
  }

  closePhoto() {
    this.selectedPhoto.set(null);
  }

  // 🔥 remplace ton ancien parseTags
  parseTags(tags: string): string[] {
    return tags.split(',').map(t => t.trim());
  }

  private _doSearch(q: string) {
    this.state.set('loading');
    this.lastQuery.set(q);
    this.photos.set([]);

    this.api.getPhotos(q).subscribe({
      next: res => {
        this.photos.set(res.photos);
        this.state.set(res.count > 0 ? 'results' : 'empty');
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Erreur API');
        this.state.set('error');
      }
    });
  }
}