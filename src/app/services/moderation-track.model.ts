import {Moderator} from './moderator.model';

export interface ModerationTrack {
  id?: string;
  moderator: Moderator;
  channel: string;
  startTime: string;
  endTime: string;
}
