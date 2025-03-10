import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrozenAccountPageComponent } from './frozen-account-page.component';

describe('FrozenAccountPageComponent', () => {
  let component: FrozenAccountPageComponent;
  let fixture: ComponentFixture<FrozenAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrozenAccountPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrozenAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
