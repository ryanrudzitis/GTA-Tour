import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2HComponent } from './h2-h.component';

describe('H2HComponent', () => {
  let component: H2HComponent;
  let fixture: ComponentFixture<H2HComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H2HComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(H2HComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
