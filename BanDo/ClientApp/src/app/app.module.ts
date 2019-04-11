import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer/customer.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectComponent } from './project/project.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { MapImageComponent } from './map-image/map-image.component';
import { SlotListComponent } from './slot-list/slot-list.component';
import { SlotComponent } from './slot/slot.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    CustomerListComponent,
    CustomerComponent,
    ProjectListComponent,
    ProjectComponent,
    LoginComponent,
    MapComponent,
    MapImageComponent,
    SlotListComponent,
    SlotComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'customer/:id', component: CustomerComponent },
      { path: 'customer', component: CustomerListComponent },
      { path: 'project/:id', component: ProjectComponent },
      { path: 'project', component: ProjectListComponent },
      { path: 'login', component: LoginComponent },
      { path: 'map', component: MapComponent },
      { path: 'map-image', component: MapImageComponent },
      { path: 'slot/:id', component: SlotComponent },
      { path: 'slot', component: SlotListComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
