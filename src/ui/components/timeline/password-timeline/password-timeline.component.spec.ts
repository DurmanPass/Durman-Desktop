import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordTimelineComponent } from './password-timeline.component';

describe('PasswordTimelineComponent', () => {
  let component: PasswordTimelineComponent;
  let fixture: ComponentFixture<PasswordTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
