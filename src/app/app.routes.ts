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
