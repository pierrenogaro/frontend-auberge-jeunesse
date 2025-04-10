import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBedComponent } from './create-bed.component';

describe('CreateBedComponent', () => {
  let component: CreateBedComponent;
  let fixture: ComponentFixture<CreateBedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
