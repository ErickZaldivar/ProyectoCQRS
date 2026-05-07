import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSuperAdmin } from './panel-super-admin';

describe('PanelSuperAdmin', () => {
  let component: PanelSuperAdmin;
  let fixture: ComponentFixture<PanelSuperAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelSuperAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelSuperAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
