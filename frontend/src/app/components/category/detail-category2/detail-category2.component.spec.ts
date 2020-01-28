import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCategory2Component } from './detail-category2.component';

describe('DetailCategory2Component', () => {
  let component: DetailCategory2Component;
  let fixture: ComponentFixture<DetailCategory2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCategory2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCategory2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
