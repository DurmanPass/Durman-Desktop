import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTabContentComponent } from './home-tab-content.component';

describe('HomeTabContentComponent', () => {
  let component: HomeTabContentComponent;
  let fixture: ComponentFixture<HomeTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
