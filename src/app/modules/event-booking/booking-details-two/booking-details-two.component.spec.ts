import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsTwoComponent } from './booking-details-two.component';

describe('BookingDetailsTwoComponent', () => {
  let component: BookingDetailsTwoComponent;
  let fixture: ComponentFixture<BookingDetailsTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDetailsTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDetailsTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
