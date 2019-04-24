import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesListComponent } from './list.component';

describe('InvoicesListComponent', () => {
  let component: InvoicesListComponent;
  let fixture: ComponentFixture<InvoicesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoicesListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
