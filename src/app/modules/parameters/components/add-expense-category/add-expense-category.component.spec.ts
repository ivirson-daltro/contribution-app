import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseCategoryComponent } from './add-expense-category.component';

describe('AddExpenseCategoryComponent', () => {
  let component: AddExpenseCategoryComponent;
  let fixture: ComponentFixture<AddExpenseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpenseCategoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
