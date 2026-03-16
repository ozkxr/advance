import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionLaboral } from './relacion-laboral';

describe('RelacionLaboral', () => {
  let component: RelacionLaboral;
  let fixture: ComponentFixture<RelacionLaboral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelacionLaboral],
    }).compileComponents();

    fixture = TestBed.createComponent(RelacionLaboral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
