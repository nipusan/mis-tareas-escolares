import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';



export interface ModeType {
  colSize: number;
  mqAlias: String;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  mediaSub: Subscription;
  activeMediaQuery: String;

  modes: ModeType[];
  mode: ModeType;

  search: number;


  public colSize = 3;
  public isMobile: boolean = false;

  constructor(public authSvc: AuthService, breakpointObserver: BreakpointObserver, public mediaObserver: MediaObserver, private route: ActivatedRoute) {

    console.log('Called Constructor');
    this.route.queryParams.subscribe(params => {
        this.search = params['search'];
    });

    breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
      if (this.isMobile) {
        this.colSize = 1;
      } else {
        this.colSize = 3;
      }
    });

    this.modes = [
      { colSize: 1, mqAlias: "xs" },
      { colSize: 1, mqAlias: "sm" },
      { colSize: 1, mqAlias: "md" },
      { colSize: 3, mqAlias: "lg" },
      { colSize: 4, mqAlias: "lx" },
    ]

    this.mode = this.modes[3];
  }

  ngOnInit(): void {
    /** this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange)=> {
      console.log(result.mqAlias);
    }) */



    this.mediaSub = this.mediaObserver.asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      ).subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
        let activeMode = this.modes.filter(mode => mode.mqAlias === change.mqAlias);
        if (activeMode.length !== 0) {
          console.log(activeMode[0].mqAlias)
          this.mode = activeMode[0];
          this.colSize = activeMode[0].colSize;
        } else {
          this.mode = this.modes[3];
          this.colSize = this.mode.colSize;
        }
      });
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }
}
