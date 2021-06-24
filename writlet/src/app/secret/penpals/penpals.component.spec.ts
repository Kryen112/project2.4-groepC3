import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenpalsComponent } from './penpals.component';

describe('PenpalsComponent', () => {
  let component: PenpalsComponent;
  let fixture: ComponentFixture<PenpalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenpalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenpalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
