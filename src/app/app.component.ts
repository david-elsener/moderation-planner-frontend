import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Moderation Planner</h1>
    <nav>
      <a routerLink="/calendar" routerLinkActive="active">Calendar</a> |
      <a routerLink="/moderators" routerLinkActive="active">Moderators</a> |
      <a routerLink="/moderation-tracks" routerLinkActive="active">Moderation Tracks</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav a {
      margin-right: 10px;
      text-decoration: none;
    }
    .active {
      font-weight: bold;
      text-decoration: underline;
    }
  `]
})
export class AppComponent { }
