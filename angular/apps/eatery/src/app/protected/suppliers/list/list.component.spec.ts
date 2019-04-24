import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersListComponent } from './list.component';

describe('SuppliersListComponent', () => {
  let component: SuppliersListComponent;
  let fixture: ComponentFixture<SuppliersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuppliersListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
