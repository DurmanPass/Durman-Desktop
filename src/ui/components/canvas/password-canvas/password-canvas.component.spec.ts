import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordCanvasComponent } from './password-canvas.component';

describe('PasswordCanvasComponent', () => {
  let component: PasswordCanvasComponent;
  let fixture: ComponentFixture<PasswordCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
