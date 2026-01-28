import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributionComponent } from './add-contributions.component';

describe('AddContributionComponent', () => {
  let component: AddContributionComponent;
  let fixture: ComponentFixture<AddContributionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContributionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddContributionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
