import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContributionsComponent } from './list-contributions.component';

describe('ListContributionsComponent', () => {
  let component: ListContributionsComponent;
  let fixture: ComponentFixture<ListContributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListContributionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListContributionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
