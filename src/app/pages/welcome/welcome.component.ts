import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

  words: string[] = [
    'easily',        // English
    'facilement',    // Français
    'بسهولة',        // Arabe
    'fácilmente',    // Espagnol
    'einfach',       // Allemand
    'facilmente',    // Italien
    '簡単に',         // Japonais
    '쉽게'            // Coréen
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
  index = 0;

  ngOnInit() {
    setInterval(() => {
      this.index = (this.index + 1) % this.words.length;
      this.currentWord = this.words[this.index];
      this.currentColor = this.colors[this.index % this.colors.length];
    }, 2000);
  }
}