import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  selected: any = {};
  /**
   * Form
   */
  reactiveForm: FormGroup;


  public placeholder: string = 'Enter the Country Name';
  public keyword = 'name';
  public historyHeading: string = 'Recently selected';

  /*  public countriesTemplate = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
      'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',
      'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
      'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Ireland', 'Italy', 'Kosovo',
      'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',
      'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
      'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
      'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];*/

  public countriesTemplate = [{name: 'Albania'}, {name: 'Andorra'}, {name: 'Armenia'}, {name: 'Austria'}];


  public countriesReactive = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
    'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Ireland', 'Italy', 'Kosovo',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',
    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];

  constructor(private _fb: FormBuilder) {
    this.reactiveForm = _fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  set() {
    this.selected = this.countriesTemplate[2];
    console.log('countriesTemplate', this.countriesTemplate);
    console.log('selected', this.selected);
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
