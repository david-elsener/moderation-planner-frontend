import { TestBed } from '@angular/core/testing';

import { ModerationTrackService } from './moderation-track.service';

describe('ModerationTrackService', () => {
  let service: ModerationTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModerationTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
