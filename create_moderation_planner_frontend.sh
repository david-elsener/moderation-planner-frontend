#!/bin/bash

# Define project root
PROJECT_ROOT="moderation-planner-frontend"

# Create Angular project
npx -p @angular/cli@latest ng new $PROJECT_ROOT --routing --standalone --style=scss --skip-install

cd $PROJECT_ROOT

# Install required dependencies
npm install
npm install @angular/material @angular/forms @fullcalendar/angular @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Generate Standalone Components and Services
npx ng generate component components/moderators --standalone
npx ng generate component components/moderation-tracks --standalone
npx ng generate component components/calendar-view --standalone
npx ng generate service services/moderator
npx ng generate service services/moderation-track

# Update main.ts for provideRouter and HttpClient
cat <<EOL > src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
}).catch(err => console.error(err));
EOL

# Create app.routes.ts
cat <<EOL > src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ModeratorsComponent } from './components/moderators/moderators.component';
import { ModerationTracksComponent } from './components/moderation-tracks/moderation-tracks.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'moderators', component: ModeratorsComponent },
  { path: 'moderation-tracks', component: ModerationTracksComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: '**', redirectTo: '/calendar' }
];
EOL

# Create app.component.ts (Standalone)
cat <<EOL > src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <h1>Moderation Planner</h1>
    <nav>
      <a routerLink="/calendar" routerLinkActive="active">Calendar</a> |
      <a routerLink="/moderators" routerLinkActive="active">Moderators</a> |
      <a routerLink="/moderation-tracks" routerLinkActive="active">Moderation Tracks</a>
    </nav>
    <router-outlet></router-outlet>
  \`,
  styles: [\`
    nav a {
      margin-right: 10px;
      text-decoration: none;
    }
    .active {
      font-weight: bold;
      text-decoration: underline;
    }
  \`]
})
export class AppComponent { }
EOL

# Create Moderator model
cat <<EOL > src/app/services/moderator.model.ts
export interface Moderator {
  id?: string;
  firstName: string;
  lastName: string;
  imageData: string; // Base64 encoded image
}
EOL

# Create ModerationTrack model
cat <<EOL > src/app/services/moderation-track.model.ts
export interface ModerationTrack {
  id?: string;
  moderatorId: string;
  channel: string;
  startTime: string;
  endTime: string;
}
EOL

# Create Moderator service
cat <<EOL > src/app/services/moderator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Moderator } from './moderator.model';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  private apiUrl = 'http://localhost:8080/api/moderators';

  constructor(private http: HttpClient) { }

  getModerators(): Observable<Moderator[]> {
    return this.http.get<Moderator[]>(this.apiUrl);
  }

  addModerator(formData: FormData): Observable<Moderator> {
    return this.http.post<Moderator>(this.apiUrl, formData);
  }

  deleteModerator(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}
EOL

# Create ModerationTrack service
cat <<EOL > src/app/services/moderation-track.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModerationTrack } from './moderation-track.model';

@Injectable({
  providedIn: 'root'
})
export class ModerationTrackService {

  private apiUrl = 'http://localhost:8080/api/tracks';

  constructor(private http: HttpClient) { }

  getTracks(): Observable<ModerationTrack[]> {
    return this.http.get<ModerationTrack[]>(this.apiUrl);
  }

  addTrack(track: ModerationTrack): Observable<ModerationTrack> {
    return this.http.post<ModerationTrack>(this.apiUrl, track);
  }

  deleteTrack(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}
EOL

# Create ModeratorsComponent.ts (Standalone)
cat <<EOL > src/app/components/moderators/moderators.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModeratorService } from '../../services/moderator.service';
import { Moderator } from '../../services/moderator.model';

@Component({
  selector: 'app-moderators',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderators.component.html',
  styleUrls: ['./moderators.component.scss']
})
export class ModeratorsComponent implements OnInit {

  moderators: Moderator[] = [];
  firstName: string = '';
  lastName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private moderatorService: ModeratorService) {}

  ngOnInit(): void {
    this.loadModerators();
  }

  loadModerators(): void {
    this.moderatorService.getModerators().subscribe(data => {
      this.moderators = data;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addModerator(): void {
    if (!this.firstName || !this.lastName || !this.selectedFile) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.moderatorService.addModerator(formData).subscribe(() => {
      this.loadModerators();
      this.firstName = '';
      this.lastName = '';
      this.selectedFile = null;
      this.imagePreview = null;
    });
  }

  deleteModerator(id: string): void {
    this.moderatorService.deleteModerator(id).subscribe(() => {
      this.loadModerators();
    });
  }
}
EOL

# Create ModeratorsComponent HTML
cat <<EOL > src/app/components/moderators/moderators.component.html
<h2>Moderators</h2>

<form (ngSubmit)="addModerator()">
  <input type="text" [(ngModel)]="firstName" name="firstName" placeholder="First Name" required>
  <input type="text" [(ngModel)]="lastName" name="lastName" placeholder="Last Name" required>
  <input type="file" (change)="onFileSelected(\$event)" required>

  <div *ngIf="imagePreview">
    <h3>Image Preview:</h3>
    <img [src]="imagePreview" alt="Image Preview" width="150">
  </div>

  <button type="submit">Add Moderator</button>
</form>

<hr>

<ul>
  <li *ngFor="let moderator of moderators">
    <img [src]="moderator.imageData" alt="{{moderator.firstName}}" width="100">
    {{ moderator.firstName }} {{ moderator.lastName }}
    <button (click)="deleteModerator(moderator.id!)">Delete</button>
  </li>
</ul>
EOL

# Create CalendarViewComponent.ts with FullCalendar Plugins
cat <<EOL > src/app/components/calendar-view/calendar-view.component.ts
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { ModerationTrackService } from '../../services/moderation-track.service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: []
  };

  constructor(private trackService: ModerationTrackService) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  loadTracks(): void {
    this.trackService.getTracks().subscribe(tracks => {
      this.calendarOptions.events = tracks.map(track => ({
        title: \`\${track.channel}\`,
        start: track.startTime,
        end: track.endTime
      }));
    });
  }
}
EOL

# Create CalendarViewComponent HTML
cat <<EOL > src/app/components/calendar-view/calendar-view.component.html
<h2>Moderation Calendar</h2>
<full-calendar [options]="calendarOptions"></full-calendar>
EOL

echo "🎉 Angular Frontend mit allen Komponenten, korrektem Routing und Fehlerbehebungen wurde erfolgreich erstellt!"
