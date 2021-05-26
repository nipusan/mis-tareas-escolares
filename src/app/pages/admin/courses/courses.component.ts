import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ModalCourseComponent } from './../components/modal-course/modal-course.component';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CoursesService } from './../services/courses.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements AfterViewInit, OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'code', 'startDate', 'endDate', 'state', 'actions'];
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(private courseSvc: CoursesService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.courseSvc.getMyCourses().subscribe((courses) => {
      this.dataSource.data = courses;
      console.log(this.dataSource.data);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  onDelete(courseId: number): void {
    if (window.confirm('Do you really want remove this course')) {
      this.courseSvc
        .delete(courseId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          window.alert(res);
          // Update result after deleting the course.
          this.courseSvc.getMyCourses().subscribe((courses) => {
            this.dataSource.data = courses;
          });
        });
    }
  }

  onOpenModal(course = {}): void {
    console.log('Course->', course);
    let dialogRef = this.dialog.open(ModalCourseComponent, {
      height: '400px',
      width: '600px',
      hasBackdrop: false,
      data: { title: 'New course', course },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`, typeof result);
      // Update result after adding new course.
      this.courseSvc.getMyCourses().subscribe((courses) => {

        console.log('deberia actualiozar los cursos');
        console.log(courses);
        this.dataSource.data = courses;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
