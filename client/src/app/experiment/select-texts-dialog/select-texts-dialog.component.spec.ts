import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectTextsDialogComponent } from './select-texts-dialog.component';

describe('SelectTextsDialogComponent', () => {
  let component: SelectTextsDialogComponent;
  let fixture: ComponentFixture<SelectTextsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTextsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTextsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
