import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributionTypeComponent } from './add-contribution-type.component';

describe('AddContributionTypeComponent', () => {
  let component: AddContributionTypeComponent;
  let fixture: ComponentFixture<AddContributionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContributionTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContributionTypeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
