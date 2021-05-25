import { SearchActivitiesComponent } from './../admin/components/search-activities/search-activities.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MaterialModule } from '@app/material.module';


@NgModule({
  declarations: [HomeComponent, SearchActivitiesComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule
  ]
})
export class HomeModule { }
