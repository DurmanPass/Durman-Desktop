import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordGeneratePageComponent } from './password-generate-page.component';

describe('PasswordGeneratePageComponent', () => {
  let component: PasswordGeneratePageComponent;
  let fixture: ComponentFixture<PasswordGeneratePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordGeneratePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordGeneratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
