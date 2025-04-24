import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordTreeComponent } from './password-tree.component';

describe('PasswordTreeComponent', () => {
  let component: PasswordTreeComponent;
  let fixture: ComponentFixture<PasswordTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
