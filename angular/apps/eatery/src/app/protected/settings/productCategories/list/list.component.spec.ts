import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoriesListComponent } from './list.component';

describe('ProductCategoriesListComponent', () => {
  let component: ProductCategoriesListComponent;
  let fixture: ComponentFixture<ProductCategoriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCategoriesListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
