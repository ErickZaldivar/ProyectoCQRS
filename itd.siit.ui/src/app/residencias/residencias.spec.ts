import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Residencias } from './residencias';

describe('Residencias', () => {
  let component: Residencias;
  let fixture: ComponentFixture<Residencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Residencias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Residencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
