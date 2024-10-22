import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResultGraphComponent } from './result-graph.component';

describe('ResultGraphComponent', () => {
  let component: ResultGraphComponent;
  let fixture: ComponentFixture<ResultGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
