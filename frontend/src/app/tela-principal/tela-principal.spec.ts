import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaPrincipal } from './tela-principal';

describe('TelaPrincipal', () => {
  let component: TelaPrincipal;
  let fixture: ComponentFixture<TelaPrincipal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaPrincipal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaPrincipal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
