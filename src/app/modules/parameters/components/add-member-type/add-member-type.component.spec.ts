import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberTypeComponent } from './add-member-type.component';

describe('AddMemberTypeComponent', () => {
  let component: AddMemberTypeComponent;
  let fixture: ComponentFixture<AddMemberTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMemberTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemberTypeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
