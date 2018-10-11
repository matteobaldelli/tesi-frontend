import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitsComponent } from './visits/visits.component';
import { VisitComponent } from './visit/visit.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'visits', component: VisitsComponent, canActivate: [AuthGuard] },
  { path: 'visit/:id', component: VisitComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'visits' }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
