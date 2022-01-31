import {Component, OnInit} from '@angular/core';
import pkg from '../../../package.json';
import {OAuthService} from 'angular-oauth2-oidc';
import {TranslateService} from '@ngx-translate/core';
import {ConsentDialog} from '../consent/consent.component';
import {MatDialog} from '@angular/material/dialog';
import {BackendService} from '../services/backend.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  public title = 'Data Management Plan';
  public version: string = pkg.version;
  public name: string;
  public lang = 'EN';
  public widescreen = () => window.innerWidth >= 1024;

  constructor(
    private auth: OAuthService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private backendService: BackendService
    ) {
      const claims = this.auth.getIdentityClaims();
      this.name = claims['name'];
  }

  ngOnInit() {
    const consentResponse = this.backendService.getConsentGiven()
    let consentGiven = false;

    consentResponse.subscribe(response => {
                if(response) {
                  console.log('1true');
                  const consentGiven = true;
                }
                else {console.log('1false');}
          });

    console.log(consentGiven);

    if (consentGiven === false) {
      const dialogRef = this.dialog.open(ConsentDialog);

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  useLanguage(language: string): void {
    this.lang = language.toUpperCase();
    this.translate.use(language);
  }

  public logout() {
    this.auth.logOut();
  }

}
