import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoExistePage } from './no-existe.page';

describe('NoExistePage', () => {
  let component: NoExistePage;
  let fixture: ComponentFixture<NoExistePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoExistePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });
});
