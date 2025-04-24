import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPieComponent } from './password-pie.component';

describe('PasswordPieComponent', () => {
  let component: PasswordPieComponent;
  let fixture: ComponentFixture<PasswordPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordPieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
