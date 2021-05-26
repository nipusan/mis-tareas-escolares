import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ModalComponent } from './../components/modal/modal.component';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from './../services/users.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements AfterViewInit, OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'role', 'username', 'names', 'surnames', 'documentType', 'document', 'actions'];
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(private userSvc: UsersService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userSvc.getAll().subscribe((users) => {
      this.dataSource.data = users;
      console.log(this.dataSource.data);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  onDelete(userId: number): void {
    if (window.confirm('Do you really want remove this user')) {
      this.userSvc
        .delete(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          window.alert(res);
          // Update result after deleting the user.
          this.userSvc.getAll().subscribe((users) => {
            this.dataSource.data = users;
          });
        });
    }
  }

  onOpenModal(user = {}): void {
    console.log('User->', user);
    let dialogRef = this.dialog.open(ModalComponent, {
      height: '400px',
      width: '600px',
      hasBackdrop: false,
      data: { title: 'New user', user },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`, typeof result);
      // Update result after adding new user.
      this.userSvc.getAll().subscribe((users) => {
        this.dataSource.data = users;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
