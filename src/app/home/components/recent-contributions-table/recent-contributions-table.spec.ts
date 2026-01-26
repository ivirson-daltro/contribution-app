import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentContributionsTable } from './recent-contributions-table';

describe('RecentContributionsTable', () => {
  let component: RecentContributionsTable;
  let fixture: ComponentFixture<RecentContributionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentContributionsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentContributionsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
