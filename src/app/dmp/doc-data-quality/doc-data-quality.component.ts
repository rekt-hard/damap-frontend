import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dmp-doc-data-quality',
  templateUrl: './doc-data-quality.component.html',
  styleUrls: ['./doc-data-quality.component.css']
})
export class DocDataQualityComponent implements OnInit {

  @Input() docDataStep: FormGroup;
  optionsMetadata: string[] = ['README-files at file-level', 'README-files at dataset-level', 'README-files at project-level'];
  optionsDataGeneration: string[] = ['Specific software will be used to process the raw data', 'Specific software will be used to conduct statistics', 'Specific software will be used to create graphical representations', 'Specific software will be used to make drawings'];
  optionsStructureAndVersioning: string[] = ['The respective work package leader will handle the structure and versioning of the research data'];

  constructor() { }

  ngOnInit(): void {
  }

}
