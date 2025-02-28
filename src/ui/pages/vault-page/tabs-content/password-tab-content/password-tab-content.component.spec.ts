import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordTabContentComponent } from './password-tab-content.component';

describe('PasswordTabContentComponent', () => {
  let component: PasswordTabContentComponent;
  let fixture: ComponentFixture<PasswordTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordTabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
