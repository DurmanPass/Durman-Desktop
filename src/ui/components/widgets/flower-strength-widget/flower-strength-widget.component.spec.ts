import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerStrengthWidgetComponent } from './flower-strength-widget.component';

describe('FlowerStrengthWidgetComponent', () => {
  let component: FlowerStrengthWidgetComponent;
  let fixture: ComponentFixture<FlowerStrengthWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowerStrengthWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlowerStrengthWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
