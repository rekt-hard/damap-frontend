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

  constructor() {
  }

  ngOnInit(): void {
  }

  get restricted() {
    return this.datasets?.value.filter(item => item.dataAccess === DataAccessType.restricted);
  }

}
