import { TestBed, inject } from '@angular/core/testing';

import { AutocompleteLibService } from './autocomplete-lib.service';

describe('AutocompleteLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutocompleteLibService]
    });
  });

  it('should be created', inject([AutocompleteLibService], (service: AutocompleteLibService) => {
    expect(service).toBeTruthy();
  }));
});
