import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap';
import { NouisliderModule } from 'ng2-nouislider';

import { AppComponent } from './app.component';
import { VisitsComponent } from './visits/visits.component';
import { VisitComponent } from './visit/visit.component';
import { MessageComponent } from './message/message.component';
import { LoginComponent } from './login/login.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { JwtInterceptor } from './jwt.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { RegisterComponent } from './register/register.component';
import { MetricsComponent } from './metrics/metrics.component';
import { CategoryComponent } from './category/category.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    VisitsComponent,
    VisitComponent,
    MessageComponent,
    LoginComponent,
    RegisterComponent,
    MetricsComponent,
    CategoryComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    NouisliderModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
