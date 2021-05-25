import { CookieService } from 'ngx-cookie-service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import * as introJs from 'intro.js/intro.js';

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

  introJS = introJs();

  mediaSub: Subscription;
  activeMediaQuery: String;

  modes: ModeType[];
  mode: ModeType;

  search: number;



  public colSize = 3;
  public isMobile: boolean = false;

  constructor(
    public authSvc: AuthService,
    breakpointObserver: BreakpointObserver,
    public mediaObserver: MediaObserver,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {

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
        this.loadTutorial();
      });
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }


  validateCookies(): Promise<any> {
    return new Promise((resolved, reject) => {
      setTimeout(() => {
        let data = this.cookieService.get('1s_ltc');
        if (data === '') {
          console.log('cookie null');
          data =  'true';
          this.cookieService.set('1s_ltc', data);

        }

        console.log('va a entrar');
        if (data === 'true') {
          console.log('entra');
          this.introJS.setOptions({
            steps: [
              {
                element: '#step1',
                intro: 'Ingrese aquí el número de documeto del estudiante!',
                position: 'bottom'
              }, {
                element: '#step2',
                intro: 'Verifique aquí las actividades asignadas!',
                position: 'bottom'
              },
              {
                element: '#step2',
                intro: 'Verifique en Estado si la actividad ya fue entregada al docente!',
                position: 'bottom'
              }
            ],
            showProgress: true
          }).start();
        }
        resolved(data);
      }, 100)
    });
  }


  loadTutorial() {

    this.validateCookies().then((response) => {
      console.log(response);
      this.cookieService.set('1s_ltc', 'false');
    });


  }

}
