import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ModalUserComponent } from './components/modal-user/modal-user.component';
import { MaterialModule } from '@app/material.module';
import { ModalCourseComponent } from './components/modal-course/modal-course.component';


@NgModule({
  declarations: [AdminComponent, ModalUserComponent, ModalCourseComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
