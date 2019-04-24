import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatementOfAccountsReportComponent } from './statement-of-accounts.component';

describe('StatementOfAccountsReportComponent', () => {
  let component: StatementOfAccountsReportComponent;
  let fixture: ComponentFixture<StatementOfAccountsReportComponent>;

  beforeEach(async(() => {
    // noinspection JSIgnoredPromiseFromCall
    TestBed.configureTestingModule({
      declarations: [StatementOfAccountsReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementOfAccountsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
