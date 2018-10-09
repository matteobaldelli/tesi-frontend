import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitsComponent } from './visits/visits.component';
import { VisitComponent } from './visit/visit.component';

const routes: Routes = [
  { path: '', redirectTo: 'visits', pathMatch: 'full' },
  { path: 'visits', component: VisitsComponent },
  { path: 'visit/:id', component: VisitComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
