import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAlumno } from './panel-alumno';

describe('PanelAlumno', () => {
  let component: PanelAlumno;
  let fixture: ComponentFixture<PanelAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelAlumno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
