import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioSocial } from './servicio-social';

describe('ServicioSocial', () => {
  let component: ServicioSocial;
  let fixture: ComponentFixture<ServicioSocial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioSocial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioSocial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
