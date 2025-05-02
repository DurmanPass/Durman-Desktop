import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTabContentComponent } from './import-tab-content.component';

describe('ImportTabContentComponent', () => {
  let component: ImportTabContentComponent;
  let fixture: ComponentFixture<ImportTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
