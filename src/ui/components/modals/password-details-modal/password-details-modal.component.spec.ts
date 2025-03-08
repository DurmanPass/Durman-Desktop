import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordDetailsModalComponent } from './password-details-modal.component';

describe('PasswordDetailsModalComponent', () => {
  let component: PasswordDetailsModalComponent;
  let fixture: ComponentFixture<PasswordDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
