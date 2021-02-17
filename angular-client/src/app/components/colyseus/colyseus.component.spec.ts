import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColyseusComponent } from './colyseus.component';

describe('ColyseusComponent', () => {
  let component: ColyseusComponent;
  let fixture: ComponentFixture<ColyseusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColyseusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColyseusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
