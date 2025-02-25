import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationTracksComponent } from './moderation-tracks.component';

describe('ModerationTracksComponent', () => {
  let component: ModerationTracksComponent;
  let fixture: ComponentFixture<ModerationTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationTracksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModerationTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
