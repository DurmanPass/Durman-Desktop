import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTabContentComponent } from './account-tab-content.component';

describe('AccountTabContentComponent', () => {
  let component: AccountTabContentComponent;
  let fixture: ComponentFixture<AccountTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
