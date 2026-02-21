import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportDialogComponent } from './monthly-report-dialog.component';

describe('MonthlyReportDialogComponent', () => {
  let component: MonthlyReportDialogComponent;
  let fixture: ComponentFixture<MonthlyReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyReportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyReportDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
