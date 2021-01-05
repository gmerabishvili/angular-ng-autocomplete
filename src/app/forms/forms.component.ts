import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  name = '';
  /**
   * Form
   */
  reactiveForm: FormGroup;


  public placeholder: string = 'Enter the Country Name';
  public keyword = 'name';
  public historyHeading: string = 'Recently selected';

  public countriesTemplate = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
    'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Ireland', 'Italy', 'Kosovo',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',
    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];

  /*
    public countriesTemplate = [{name: 'Albania'}, {name: 'Andorra'}, {name: 'Armenia'}, {name: 'Austria'}];
  */


  public countriesReactive = [
    {
      id: 1,
      name: 'Albania',
    },
    {
      id: 2,
      name: 'Belgium',
    },
    {
      id: 3,
      name: 'Denmark',
    },
    {
      id: 4,
      name: 'Montenegro',
    },
  ];


  constructor(private _fb: FormBuilder) {
    this.reactiveForm = _fb.group({
      name: [{value: '', disabled: false}, Validators.required]
    });

    this.reactiveForm.patchValue({
      name:
        {value: 1, name: 'Albania'}
    });
  }

  ngOnInit() {
  }

  set() {
    this.name = 'test';
    console.log('countriesTemplate', this.countriesTemplate);
    console.log('selected', this.name);
  }

  reset() {
    this.name = '';
  }

  /**
   * Submit template form
   */
  submitTemplateForm(value) {
    console.log(value);
  }

  /**
   * Submit reactive form
   */
  submitReactiveForm() {
    if (this.reactiveForm.valid) {
      console.log(this.reactiveForm.value);
    }
  }
}
