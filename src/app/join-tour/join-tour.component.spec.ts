import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTourComponent } from './join-tour.component';

describe('JoinTourComponent', () => {
  let component: JoinTourComponent;
  let fixture: ComponentFixture<JoinTourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinTourComponent]
    });
    fixture = TestBed.createComponent(JoinTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
