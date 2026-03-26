import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component'
import { UploadComponent } from './pages/upload/upload.component';
import { GalleryComponent } from './pages/gallery/gallery.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'gallery', component: GalleryComponent }
];
