import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../core/services/gallery.service';
import { Photo } from '../../core/models/photo.model';

type GalleryState = 'idle' | 'loading' | 'results' | 'empty' | 'error';

// Tags suggérés pour les filtres rapides
const SUGGESTED_TAGS = ['Dog', 'Cat', 'Beach', 'City', 'Nature', 'Food', 'Car', 'Forest', 'Mountain', 'Flower'];

// Photos mock pour la preview initiale
const PREVIEW_PHOTOS: Photo[] = [
  { id: 1,  url: 'https://picsum.photos/seed/dog1/400/400',     tags: 'Dog,Animal,Pet' },
  { id: 2,  url: 'https://picsum.photos/seed/beach1/400/400',   tags: 'Beach,Ocean,Summer' },
  { id: 3,  url: 'https://picsum.photos/seed/city1/400/400',    tags: 'City,Urban,Architecture' },
  { id: 4,  url: 'https://picsum.photos/seed/forest1/400/400',  tags: 'Forest,Nature,Green' },
  { id: 5,  url: 'https://picsum.photos/seed/mountain1/400/400',tags: 'Mountain,Snow,Landscape' },
  { id: 6,  url: 'https://picsum.photos/seed/flower1/400/400',  tags: 'Flower,Garden,Nature' },
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gallery-header">
      <h1>Galerie</h1>
      <p>Recherchez vos photos par tag ou explorez les suggestions.</p>
    </div>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <div class="search-bar__field">
        <svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          class="search-bar__input"
          type="text"
          placeholder="Rechercher un tag : chien, plage, ville…"
          [(ngModel)]="query"
          (keydown.enter)="search()"
          (input)="onQueryInput()"
        />
        @if (query.length > 0) {
          <button class="search-bar__clear" (click)="clearSearch()" title="Effacer">&#x2715;</button>
        }
      </div>
      <button
        class="btn btn--search"
        [disabled]="state() === 'loading' || !query.trim()"
        (click)="search()"
      >
        @if (state() === 'loading') {
          <span class="spinner"></span>
        } @else {
          Rechercher
        }
      </button>
    </div>

    <!-- Filtres rapides -->
    <div class="quick-filters">
      @for (tag of suggestedTags; track tag) {
        <button
          class="quick-filter"
          [class.quick-filter--active]="activeFilter() === tag"
          (click)="applyFilter(tag)"
        >
          {{ tag }}
        </button>
      }
    </div>

    <!-- États -->
    @switch (state()) {

      @case ('idle') {
        <div class="section-label">Aperçu</div>
        <div class="grid">
          @for (photo of previewPhotos; track photo.id) {
            <div class="photo-card" (click)="openPhoto(photo)">
              <img [src]="photo.url" [alt]="parseTags(photo.tags)[0]" loading="lazy" />
              <div class="photo-card__body">
                <div class="photo-card__tags">
                  @for (tag of parseTags(photo.tags).slice(0,3); track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      @case ('loading') {
        <div class="grid">
          @for (s of skeletons; track $index) {
            <div class="skeleton"></div>
          }
        </div>
      }

      @case ('results') {
        <div class="results-meta">
          <span class="results-count">
            {{ photos().length }} résultat{{ photos().length > 1 ? 's' : '' }}
            pour <strong>"{{ lastQuery() }}"</strong>
          </span>
          <div class="sort-bar">
            <span class="sort-label">Trier :</span>
            <button class="sort-btn" [class.sort-btn--active]="sortBy() === 'default'" (click)="setSortBy('default')">Par défaut</button>
            <button class="sort-btn" [class.sort-btn--active]="sortBy() === 'tags'"    (click)="setSortBy('tags')">Tags</button>
          </div>
        </div>
        <div class="grid">
          @for (photo of sortedPhotos(); track photo.id) {
            <div class="photo-card" (click)="openPhoto(photo)">
              <img [src]="photo.url" [alt]="parseTags(photo.tags)[0]" loading="lazy"
                   onerror="this.style.opacity='0.3'" />
              <div class="photo-card__body">
                <div class="photo-card__tags">
                  @for (tag of parseTags(photo.tags).slice(0,4); track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      @case ('empty') {
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>Aucune photo pour <strong>"{{ lastQuery() }}"</strong>.</p>
          <span>Essayez un autre tag ou explorez les suggestions ci-dessus.</span>
        </div>
      }

      @case ('error') {
        <div class="empty-state empty-state--error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          <p>{{ errorMessage() }}</p>
        </div>
      }
    }

    <!-- Lightbox -->
    @if (selectedPhoto()) {
      <div class="lightbox" (click)="closePhoto()">
        <div class="lightbox__box" (click)="$event.stopPropagation()">
          <button class="lightbox__close" (click)="closePhoto()">&#x2715;</button>
          <img [src]="selectedPhoto()!.url" [alt]="parseTags(selectedPhoto()!.tags)[0]" />
          <div class="lightbox__tags">
            @for (tag of parseTags(selectedPhoto()!.tags); track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .section-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: var(--color-text-tertiary);
      margin-bottom: 1rem;
    }

    .search-bar {
      display: flex;
      gap: .6rem;
      margin-bottom: 1rem;
      &__field {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
      }
      &__icon {
        position: absolute;
        left: .75rem;
        width: 16px;
        height: 16px;
        stroke: var(--color-text-tertiary);
        pointer-events: none;
        flex-shrink: 0;
      }
      &__input {
        width: 100%;
        padding: .6rem .9rem .6rem 2.4rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        font-size: 14px;
        font-family: inherit;
        background: var(--color-surface);
        color: var(--color-text);
        outline: none;
        transition: border-color .15s, box-shadow .15s;
        &::placeholder { color: var(--color-text-tertiary); }
        &:focus {
          border-color: var(--color-blue);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-blue) 15%, transparent);
        }
      }
      &__clear {
        position: absolute;
        right: .6rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-tertiary);
        font-size: 14px;
        padding: 2px 4px;
        border-radius: 4px;
        &:hover { color: var(--color-text); background: var(--color-bg-tertiary); }
      }
    }

    .quick-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 1.75rem;
    }

    .quick-filter {
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text-secondary);
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      transition: all .15s;
      &:hover { border-color: var(--color-blue); color: var(--color-blue); background: var(--color-blue-light); }
      &--active { border-color: var(--color-blue); color: var(--color-blue); background: var(--color-blue-light); font-weight: 500; }
    }

    .results-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: .5rem;
    }

    .sort-bar {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sort-label {
      font-size: 12px;
      color: var(--color-text-tertiary);
    }

    .sort-btn {
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      background: none;
      font-size: 12px;
      font-family: inherit;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all .15s;
      &:hover { border-color: var(--color-blue); color: var(--color-blue); }
      &--active { border-color: var(--color-blue); color: var(--color-blue); background: var(--color-blue-light); font-weight: 500; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--color-text-tertiary);
      font-size: 14px;
      svg { margin: 0 auto 1rem; display: block; width: 36px; height: 36px; }
      p { color: var(--color-text-secondary); margin-bottom: 4px; }
      span { font-size: 13px; }
      &--error { color: var(--color-red); p { color: var(--color-red); } }
    }

    .photo-card { cursor: pointer; }

    /* Lightbox */
    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.7);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1.5rem;
      animation: fadeIn .15s ease;

      &__box {
        background: var(--color-surface);
        border-radius: var(--radius);
        overflow: hidden;
        max-width: 540px;
        width: 100%;
        position: relative;
        box-shadow: 0 24px 48px rgba(0,0,0,.3);
        animation: scaleIn .15s ease;

        img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
        }
      }

      &__tags {
        padding: .9rem 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      &__close {
        position: absolute;
        top: .6rem;
        right: .6rem;
        background: rgba(0,0,0,.5);
        border: none;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background .15s;
        &:hover { background: rgba(0,0,0,.75); }
      }
    }

    @keyframes fadeIn  { from { opacity: 0; }              to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(.95); }   to { transform: scale(1); } }
  `]
})
export class GalleryComponent {
  query        = '';
  lastQuery    = signal('');
  state        = signal<GalleryState>('idle');
  photos       = signal<Photo[]>([]);
  errorMessage = signal('');
  activeFilter = signal<string | null>(null);
  sortBy       = signal<'default' | 'tags'>('default');
  selectedPhoto = signal<Photo | null>(null);

  skeletons    = Array(6);
  suggestedTags = SUGGESTED_TAGS;
  previewPhotos = PREVIEW_PHOTOS;

  sortedPhotos = computed(() => {
    const list = [...this.photos()];
    if (this.sortBy() === 'tags') {
      list.sort((a, b) => a.tags.localeCompare(b.tags));
    }
    return list;
  });

  constructor(private galleryService: GalleryService) {}

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

  setSortBy(v: 'default' | 'tags') { this.sortBy.set(v); }

  openPhoto(p: Photo)  { this.selectedPhoto.set(p); }
  closePhoto()         { this.selectedPhoto.set(null); }

  parseTags(t: string) { return this.galleryService.parseTags(t); }

  private _doSearch(q: string) {
    this.state.set('loading');
    this.lastQuery.set(q);
    this.photos.set([]);

    this.galleryService.search(q).subscribe({
      next: result => {
        this.photos.set(result.photos);
        this.state.set(result.count > 0 ? 'results' : 'empty');
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.state.set('error');
      },
    });
  }
}