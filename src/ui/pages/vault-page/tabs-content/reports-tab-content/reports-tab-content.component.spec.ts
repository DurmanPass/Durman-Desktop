import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsTabContentComponent } from './reports-tab-content.component';

describe('ReportsTabContentComponent', () => {
  let component: ReportsTabContentComponent;
  let fixture: ComponentFixture<ReportsTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsTabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
