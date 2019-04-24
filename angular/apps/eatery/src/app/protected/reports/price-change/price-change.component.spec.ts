import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceChangeReportComponent } from './price-change.component';

describe('PriceChangeReportComponent', () => {
  let component: PriceChangeReportComponent;
  let fixture: ComponentFixture<PriceChangeReportComponent>;

  beforeEach(async(() => {
    // noinspection JSIgnoredPromiseFromCall
    TestBed.configureTestingModule({
      declarations: [PriceChangeReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceChangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
