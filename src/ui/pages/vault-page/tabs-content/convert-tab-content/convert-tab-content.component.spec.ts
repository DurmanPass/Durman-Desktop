import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertTabContentComponent } from './convert-tab-content.component';

describe('ConvertTabContentComponent', () => {
  let component: ConvertTabContentComponent;
  let fixture: ComponentFixture<ConvertTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertTabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvertTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
