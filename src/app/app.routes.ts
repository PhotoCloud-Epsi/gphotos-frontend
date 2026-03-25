import { Routes } from '@angular/router';
import { UploadComponent } from './pages/upload/upload.component';
import { GalleryComponent } from './pages/gallery/gallery.component';

export const routes: Routes = [
  { path: '', component: UploadComponent },
  { path: 'gallery', component: GalleryComponent }
];
