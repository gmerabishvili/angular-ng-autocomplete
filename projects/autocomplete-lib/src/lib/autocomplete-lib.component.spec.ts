import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteLibComponent } from './autocomplete-lib.component';

describe('AutocompleteLibComponent', () => {
  let component: AutocompleteLibComponent;
  let fixture: ComponentFixture<AutocompleteLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
