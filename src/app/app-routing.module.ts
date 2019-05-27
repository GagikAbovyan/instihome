import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterAndLoginComponent } from './register-and-login/register-and-login.component';
import { ObjectTrackComponent } from './object-track/object-track.component';

const routes: Routes = [
  {path: 'login', component: RegisterAndLoginComponent},
  {path: 'user', component: ObjectTrackComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
