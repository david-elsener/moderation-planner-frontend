import {Component, OnInit} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {ModerationTrackService} from '../../services/moderation-track.service';
import {ModeratorService} from '../../services/moderator.service';
import {Moderator} from '../../services/moderator.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventContent: this.renderEventContent.bind(this)
  };

  moderators: Moderator[] = [];

  constructor(
    private trackService: ModerationTrackService,
    private moderatorService: ModeratorService
  ) {
  }

  ngOnInit(): void {
    this.loadModerators();
  }

  loadModerators(): void {
    this.moderatorService.getModerators().subscribe(data => {
      this.moderators = data;
      this.loadTracks();
    });
  }

  loadTracks(): void {
    this.trackService.getTracks().subscribe(tracks => {
      const events = tracks.map(track => {
        return {
          title: track.moderator.firstName + " " + track.moderator.lastName + " - " + track.channel,
          start: track.startTime,
          end: track.endTime,
          extendedProps: {
            moderatorImage: track.moderator?.imageData,
            moderatorName: `${track.moderator?.firstName || 'Unknown'} ${track.moderator?.lastName || ''}`
          }
        };
      });
      this.calendarOptions.events = events;
    });
  }

  renderEventContent(eventInfo: any) {
    const moderatorImage = eventInfo.event.extendedProps.moderatorImage;
    const moderatorName = eventInfo.event.extendedProps.moderatorName;
    console.log("moderator image " + moderatorImage)

    const imgHtml = moderatorImage
      ? `<img src="data:image/png;base64,${moderatorImage}" alt="${moderatorName}" style="width:40px;height:40px;border-radius:50%;margin-right:5px;">`
      : '';

    return {
      html: `<div style="display:flex;align-items:center;">
               ${imgHtml}
               <span>${eventInfo.event.title}</span>
             </div>`
    };
  }
}
