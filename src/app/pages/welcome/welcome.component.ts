import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {

  words: string[] = [
    'easily',       // English
    'facilement',   // Français
    'بسهولة',       // Arabe
    'fácilmente',   // Espagnol
    'einfach',      // Allemand
    'facilmente',   // Italien
    '簡単に',        // Japonais
    '쉽게'           // Coréen
  ];

  colors: string[] = [
    '#ff6b6b',
    '#4dabf7',
    '#51cf66',
    '#f59f00',
    '#845ef7',
    '#20c997'
  ];

  currentWord = this.words[0];
  currentColor = this.colors[0];
  fading = false;
  index = 0;

  ngOnInit() {
    setInterval(() => {
      // Déclenche le fade out
      this.fading = true;

      setTimeout(() => {
        // Change le mot pendant qu'il est invisible
        this.index = (this.index + 1) % this.words.length;
        this.currentWord = this.words[this.index];
        this.currentColor = this.colors[this.index % this.colors.length];
        // Fade in
        this.fading = false;
      }, 300);

    }, 2000);
  }
}
