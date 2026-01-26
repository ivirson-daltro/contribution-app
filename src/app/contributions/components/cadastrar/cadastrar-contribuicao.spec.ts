import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarContribuicaoComponent } from './cadastrar-contribuicao';

describe('CadastrarContribuicaoComponent', () => {
  let component: CadastrarContribuicaoComponent;
  let fixture: ComponentFixture<CadastrarContribuicaoComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarContribuicaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarContribuicaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
