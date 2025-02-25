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
        title: `${track.moderator.firstName} ${track.moderator.lastName} - ${track.channel}`,
        start: track.startTime,
        end: track.endTime
      }));
    });
  }
}
