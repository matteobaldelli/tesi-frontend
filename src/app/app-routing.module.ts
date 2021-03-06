import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { VisitsComponent } from './visits/visits.component';
import { VisitComponent } from './visit/visit.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MetricsComponent } from './metrics/metrics.component';
import { CategoryComponent } from './category/category.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UsersComponent } from './users/users.component';
import { GraphicsComponent } from './graphics/graphics.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'visits', component: VisitsComponent, canActivate: [AuthGuard] },
  { path: 'visit/:id', component: VisitComponent, canActivate: [AuthGuard] },
  { path: 'graphics', component: GraphicsComponent, canActivate: [AuthGuard], data: {admin: 'true'} },
  { path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard], data: {admin: 'true'} },
  { path: 'admin/params', component: MetricsComponent, canActivate: [AuthGuard], data: {admin: 'true'} },
  { path: 'admin/categories', component: CategoryComponent, canActivate: [AuthGuard], data: {admin: 'true'} },
  { path: 'admin/statistics', component: StatisticsComponent, canActivate: [AuthGuard], data: {admin: 'true'} },
  { path: '**', redirectTo: 'visits' }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
