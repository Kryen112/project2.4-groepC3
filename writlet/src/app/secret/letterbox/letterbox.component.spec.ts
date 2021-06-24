import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterboxComponent } from './letterbox.component';

describe('LetterboxComponent', () => {
  let component: LetterboxComponent;
  let fixture: ComponentFixture<LetterboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
