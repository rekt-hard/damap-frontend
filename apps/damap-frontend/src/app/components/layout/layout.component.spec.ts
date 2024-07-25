import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { BreakpointObserver } from '@angular/cdk/layout';
import { By } from '@angular/platform-browser';
import { ConfigService } from '../../services/config.service';
import { LayoutComponent } from './layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthService } from 'angular-oauth2-oidc';
import { TranslateTestingModule } from '@damap/core';
import { of } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let breakpointObserver: BreakpointObserver;
  let sidenav: MatSidenav;

  beforeEach(waitForAsync(() => {
    const oauthSpy = jasmine.createSpyObj('OAuthService', [
      'getIdentityClaims',
    ]);
    oauthSpy.getIdentityClaims.and.returnValue({ name: 'name' });
    const configSpy = jasmine.createSpyObj('ConfigService', ['getEnvironment']);
    configSpy.getEnvironment.and.returnValue('DEV');
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', [
      'observe',
    ]);
    breakpointObserverSpy.observe.and.returnValue(of({ matches: false }));

    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        NoopAnimationsModule,
      ],
      declarations: [LayoutComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: OAuthService, useValue: oauthSpy },
        { provide: ConfigService, useValue: configSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
      ],
    }).compileComponents();

    breakpointObserver = TestBed.inject(BreakpointObserver);
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      sidenav = fixture.debugElement.query(
        By.directive(MatSidenav),
      ).componentInstance;

      sidenav._content = {
        nativeElement: document.createElement('div'),
      } as any;
    });
  }));

  it('should create', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
    });
  }));

  it('should collapse sidenav on small screen', waitForAsync(() => {
    (breakpointObserver.observe as jasmine.Spy).and.returnValue(
      of({ matches: true }),
    );
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isSmallScreen).toBeTrue();
      expect(component.isCollapsed).toBeTrue();
      expect(sidenav).toBeDefined();
      expect(sidenav.mode).toBe('over');
      expect(sidenav.opened).toBeFalse();
    });
  }));

  it('should expand sidenav on large screen', waitForAsync(() => {
    (breakpointObserver.observe as jasmine.Spy).and.returnValue(
      of({ matches: true }),
    );
    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.isSmallScreen).toBeTrue();
      expect(component.isCollapsed).toBeTrue();
      expect(sidenav.mode).toBe('over');
      expect(sidenav.opened).toBeFalse();
    });
  }));

  it('should toggle sidenav on desktop', waitForAsync(() => {
    component.isSmallScreen = false;
    component.isCollapsed = false;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isCollapsed).toBeFalse();
      expect(sidenav).toBeDefined();
      expect(sidenav.mode).toBe('side');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.isCollapsed).toBeFalse();
      });
    });
  }));

  it('should not toggle sidenav on mobile', waitForAsync(() => {
    component.isSmallScreen = true;
    component.isCollapsed = true;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isCollapsed).toBeTrue();
      expect(sidenav).toBeDefined();
    });
  }));
});
