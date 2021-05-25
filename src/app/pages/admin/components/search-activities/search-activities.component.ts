import { ActivityStudent } from '@app/shared/models/activity-student.interface';
import { ActivityStudentService } from './../../services/activity-student.service';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-activities',
  templateUrl: './search-activities.component.html',
  styleUrls: ['./search-activities.component.scss']
})
export class SearchActivitiesComponent implements AfterViewInit, OnInit, OnDestroy {

  //displayedColumns: string[] = ['id', 'role', 'username', 'names', 'surnames', 'documentType', 'document', 'actions'];
  displayedColumns: string[] = ['id', 'name', 'content', 'startDate', 'endDate', 'course','state'];
  dataSource = new MatTableDataSource<ActivityStudent>();

  @Input() document: number;

  private destroy$ = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(private service: ActivityStudentService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.service.getActivitiesByStudentDocument(this.document).subscribe((response) => {
      this.dataSource.data = response;
      console.log(this.dataSource.data);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
