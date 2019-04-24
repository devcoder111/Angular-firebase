import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListComponent } from './list.component';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(async(() => {
    // noinspection JSIgnoredPromiseFromCall
    TestBed.configureTestingModule({
      declarations: [UsersListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
