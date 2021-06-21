import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {DataAccessType} from '../../domain/enum/data-access-type.enum';

@Component({
  selector: 'app-dmp-reuse',
  templateUrl: './reuse.component.html',
  styleUrls: ['./reuse.component.css']
})
export class ReuseComponent implements OnInit {

  @Input() reuseStep: FormGroup;
  @Input() datasets: FormArray;

  restricted: string[] = [];

  optionsTargetAudience: string[] = ['Business players such as heating and cooling equipment manufacturers, distributors, major installers and engineering companies', 
                                     'Members of the scientific community',
                                     'Engineers in the areas of building services, material development, PCM manufacturers and renewable energy industry',
                                     'Officers of local/national governments',
                                     'Decision makers in industry, particularly those related to the energy and building sectors',
                                     'Students and general public'];

  optionsPotentialUsers: string[] = ['Data/tools covered under a closed license cannot be released but technical details will be provided. If researchers can obtain same set of libraries &tools, they should be able to reproduce our results.'];                                   
  
  constructor() {
  }

  ngOnInit(): void {
    this.datasets.valueChanges.subscribe(
      newVal => {
        this.restricted = [];
        for (const val of newVal) {
          if(val.dataAccess === DataAccessType.restricted) {
            this.addRestricted(val.title);
          }
        }
      }
    )
  }

  private addRestricted(value: string) {
    this.restricted.push(value);
  }

}
