import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AuthService } from '@damap/core';
import { ConfigService } from '../../services/config.service';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import pkg from '../../../../../../package.json';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;

  public title = 'Data Management Plan';
  public version: string = pkg.version;
  public name: string;
  public lang = 'en';
  public isSmallScreen: boolean = false;
  public isCollapsed: boolean = false;

  readonly env: string;

  constructor(
    private auth: AuthService,
    private translate: TranslateService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private observer: BreakpointObserver,
  ) {
    this.env = this.configService.getEnvironment();
  }

  ngOnInit(): void {
    this.name = this.auth.getName();
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'en');
    this.lang = this.translate.currentLang.toUpperCase();

    this.observer.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
      this.sidenav.disableClose = this.isSmallScreen;
      this.checkScreenSize();
    });
  }

  ngAfterViewInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.debounce(() => this.checkScreenSize(), 300)();
  }

  private debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  private checkScreenSize(): void {
    this.isCollapsed = this.isSmallScreen;
    this.sidenav.open();
    this.updateSidenavClasses();
    this.cdr.detectChanges();
  }

  private updateSidenavClasses(): void {
    const container = document.querySelector('.mat-sidenav-container');
    if (container) {
      container.classList.toggle(
        'mat-sidenav-opened',
        !this.isCollapsed || this.isSmallScreen,
      );
      container.classList.remove('mat-sidenav-collapsed');
    }
  }

  useLanguage(language: string): void {
    this.lang = language.toUpperCase();
    this.translate.use(language);
  }

  public logout(): void {
    this.auth.logout();
  }

  toggleMenu(): void {
    if (!this.isSmallScreen) {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
