import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentContributionsTableComponent } from './recent-contributions-table.component';

describe('RecentContributionsTableComponent', () => {
  let component: RecentContributionsTableComponent;
  let fixture: ComponentFixture<RecentContributionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentContributionsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentContributionsTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
