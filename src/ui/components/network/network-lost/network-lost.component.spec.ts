import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkLostComponent } from './network-lost.component';

describe('NetworkLostComponent', () => {
  let component: NetworkLostComponent;
  let fixture: ComponentFixture<NetworkLostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkLostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetworkLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
