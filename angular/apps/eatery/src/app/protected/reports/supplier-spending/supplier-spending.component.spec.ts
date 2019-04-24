import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierSpendingReportComponent } from './supplier-spending.component';

describe('SupplierSpendingReportComponent', () => {
  let component: SupplierSpendingReportComponent;
  let fixture: ComponentFixture<SupplierSpendingReportComponent>;

  beforeEach(async(() => {
    // noinspection JSIgnoredPromiseFromCall
    TestBed.configureTestingModule({
      declarations: [SupplierSpendingReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSpendingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
