import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTabContentComponent } from './settings-tab-content.component';

describe('SettingsTabContentComponent', () => {
  let component: SettingsTabContentComponent;
  let fixture: ComponentFixture<SettingsTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsTabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
