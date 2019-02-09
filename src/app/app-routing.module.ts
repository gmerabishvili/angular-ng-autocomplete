import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FormsComponent} from './forms/forms.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'forms', component: FormsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
