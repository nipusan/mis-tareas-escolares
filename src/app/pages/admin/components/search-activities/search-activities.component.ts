import { Util } from './../../../../shared/utils/util';
import { ActivityStudent } from '@app/shared/models/activity-student.interface';
import { ActivityStudentService } from './../../services/activity-student.service';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { Student } from '@app/shared/models/student.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-activities',
  templateUrl: './search-activities.component.html',
  styleUrls: ['./search-activities.component.scss']
})
export class SearchActivitiesComponent implements AfterViewInit, OnInit, OnDestroy {

  //displayedColumns: string[] = ['id', 'role', 'username', 'names', 'surnames', 'documentType', 'document', 'actions'];
  displayedColumns: string[] = ['state', 'name', 'content', 'startDate', 'endDate', 'course', 'observation'];
  dataSource = new MatTableDataSource<ActivityStudent>();
  studentData: Student;

  @Input() document: number;

  private destroy$ = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private service: ActivityStudentService,
    private snackBar: MatSnackBar) {
    this.studentData = null;
  }

  ngOnInit(): void {
    if (Util.check(this.document)) {
      console.log('numero válido');
      this.service.getActivitiesByStudentDocument(this.document).subscribe((response) => {
        this.dataSource.data = response;
        this.extractStudentData(response);
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  extractStudentData(response: any): void {
    try {
      console.log('init extractStudentData');
      this.studentData = response[0].student;
      console.log(this.studentData);
    } catch (error) {
      console.log(error);
      this.snackBar.open('Sin resultados:', 'El número de documento no se encuentra registrado!', { duration: 5000, verticalPosition: 'top' });
    }
  }

}
