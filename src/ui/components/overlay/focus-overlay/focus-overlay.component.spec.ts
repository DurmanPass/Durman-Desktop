import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusOverlayComponent } from './focus-overlay.component';

describe('FocusOverlayComponent', () => {
  let component: FocusOverlayComponent;
  let fixture: ComponentFixture<FocusOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FocusOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
