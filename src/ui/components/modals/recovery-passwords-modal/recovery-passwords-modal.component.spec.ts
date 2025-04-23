import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPasswordsModalComponent } from './recovery-passwords-modal.component';

describe('RecoveryPasswordsModalComponent', () => {
  let component: RecoveryPasswordsModalComponent;
  let fixture: ComponentFixture<RecoveryPasswordsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPasswordsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecoveryPasswordsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
