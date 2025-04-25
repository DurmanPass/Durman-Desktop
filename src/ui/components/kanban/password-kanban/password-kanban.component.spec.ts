import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordKanbanComponent } from './password-kanban.component';

describe('PasswordKanbanComponent', () => {
  let component: PasswordKanbanComponent;
  let fixture: ComponentFixture<PasswordKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordKanbanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
