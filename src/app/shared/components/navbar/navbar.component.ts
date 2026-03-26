import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar__logo" routerLink="/welcome" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        PhotoCloud
      </div>
      <a class="navbar__tab" routerLink="/upload" routerLinkActive="navbar__tab--active">
        Déposer une image
      </a>
      <a class="navbar__tab" routerLink="/gallery" routerLinkActive="navbar__tab--active">
        Galerie
      </a>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      border-bottom: 0.5px solid var(--color-border);
      padding: 0 2rem;
      background: var(--color-bg);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .navbar__logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 500;
      padding: 1rem 0;
      margin-right: 2rem;
      color: var(--color-text);
      text-decoration: none;
    }
    .navbar__logo svg { width: 18px; height: 18px; }
    .navbar__tab {
      padding: 1rem 1.25rem;
      font-size: 14px;
      color: var(--color-text-secondary);
      text-decoration: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -0.5px;
      transition: color .15s, border-color .15s;
    }
    .navbar__tab:hover { color: var(--color-text); }
    .navbar__tab--active { color: var(--color-blue); border-bottom-color: var(--color-blue); }
  `]
})
export class NavbarComponent {}