import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarMembro } from './cadastrar-membro';

describe('CadastrarMembro', () => {
  let component: CadastrarMembro;
  let fixture: ComponentFixture<CadastrarMembro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarMembro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarMembro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
