import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignaturaPage } from './asignatura.page';

describe('AsignaturaPage', () => {
  let component: AsignaturaPage;
  let fixture: ComponentFixture<AsignaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
