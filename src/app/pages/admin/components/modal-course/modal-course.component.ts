import { AuthService } from '../../../auth/auth.service';
import { UserResponse } from '@shared/models/user.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BaseFormCourse } from '@shared/utils/base-form-course';
enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal-course.component.html',
  styleUrls: ['./modal-course.component.scss'],
})
export class ModalCourseComponent implements OnInit {

  isAdmin = null;
  isLogged = false;

  private destroy$ = new Subject<any>();

  actionTODO = Action.NEW;
  hide = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public courseForm: BaseFormCourse,
    private courseSvc: CoursesService
  ) { }

  ngOnInit(): void {
    if (this.data?.course.hasOwnProperty('id')) {
      console.log('init modal course')
      console.log(this.data)
      this.actionTODO = Action.EDIT;

      console.log('updateValueAndValidity')
      this.courseForm.baseForm.updateValueAndValidity();
      this.data.title = 'Edit course';
      this.pathFormData();
    }

  }

  onSave(): void {
    const formValue = this.courseForm.baseForm.value;
    console.log('curso para actualizar: ');
    console.log(formValue);
    if (this.actionTODO === Action.NEW) {
      console.log('vamos a guardar la data');
      this.courseSvc.new(formValue).subscribe((res) => {
        console.log('New ', res);
      });
    } else {
      const courseId = this.data?.course?.id;
      this.courseSvc.update(courseId, formValue).subscribe((res) => {
        console.log('Update', res);
      });
    }
  }

  checkField(field: string): boolean {
    return this.courseForm.isValidField(field);
  }

  private pathFormData(): void {
    console.log('courseForm.baseForm.patchValue')
    this.courseForm.baseForm.patchValue({
      code: this.data?.course?.code,
      name: this.data?.course?.name,
      startDate: this.data?.course?.startDate,
      endDate: this.data?.course?.endDate,
      state: this.data?.course?.state
    });

    console.log('validando data')
    console.log(this.data?.course?.code)
  }
}
