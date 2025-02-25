import {Moderator} from './moderator.model';

export interface ModerationTrack {
  id?: string;
  moderator: Moderator;
  channel: string;
  startTime: string;
  endTime: string;
}

export interface CreateTrack {
  id?: string;
  moderatorId: string;
  channel: string;
  startTime: string;
  endTime: string;
}
