import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTCategoryComponent } from './add-t-category.component';

describe('AddTCategoryComponent', () => {
  let component: AddTCategoryComponent;
  let fixture: ComponentFixture<AddTCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
