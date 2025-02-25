import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';

import {ModerationTrackService} from '../../services/moderation-track.service';
import {ModeratorService} from '../../services/moderator.service';
import {ModerationTrack} from '../../services/moderation-track.model';
import {Moderator} from '../../services/moderator.model';

@Component({
  selector: 'app-moderation-tracks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule
  ],
  templateUrl: './moderation-tracks.component.html',
  styleUrls: ['./moderation-tracks.component.scss']
})
export class ModerationTracksComponent implements OnInit {

  tracks: (ModerationTrack & { moderatorName?: string })[] = [];
  moderators: Moderator[] = [];
  trackForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private trackService: ModerationTrackService,
    private moderatorService: ModeratorService
  ) {
  }

  ngOnInit(): void {
    this.loadModerators();
    this.loadTracks();

    this.trackForm = this.fb.group({
      moderatorId: ['', Validators.required],
      channel: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  loadTracks(): void {
    this.trackService.getTracks().subscribe(tracks => {
      this.tracks = tracks
    })
  }

  loadModerators(): void {
    this.moderatorService.getModerators().subscribe(data => {
      this.moderators = data;
    });
  }

  addTrack(): void {
    if (this.trackForm.invalid) {
      alert('Please fill all fields.');
      return;
    }

    const newTrack: ModerationTrack = {
      moderator: this.trackForm.value.moderator,
      channel: this.trackForm.value.channel,
      startTime: this.trackForm.value.startTime,
      endTime: this.trackForm.value.endTime
    };

    this.trackService.addTrack(newTrack).subscribe(() => {
      this.loadTracks();
      this.trackForm.reset();
    });
  }

  deleteTrack(id: string): void {
    if (confirm('Are you sure you want to delete this track?')) {
      this.trackService.deleteTrack(id).subscribe(() => {
        this.loadTracks();
      });
    }
  }
}
