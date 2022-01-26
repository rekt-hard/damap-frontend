import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataKind} from '../../domain/enum/data-kind.enum';
import {FILE_SIZES, FILE_TYPES} from './data-specs';
import {FormService} from '../../services/form.service';

@Component({
  selector: 'app-dmp-specify-data',
  templateUrl: './specify-data.component.html',
  styleUrls: ['./specify-data.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SpecifyDataComponent implements OnInit {

  @Input() specifyDataStep: FormGroup;
  @Input() datasets: FormArray;
  @Input() fileUpload: { file: File, progress: number, finalized: boolean }[];

  @Output() createDataset = new EventEmitter<string>();
  @Output() updateDataset = new EventEmitter<any>();
  @Output() fileToAnalyse = new EventEmitter<File>();
  @Output() uploadToCancel = new EventEmitter<number>();
  @Output() removeDataset = new EventEmitter<number>();

  dataSource = new MatTableDataSource();
  readonly tableHeaders: string[] = ['dataset', 'datatype', 'size', 'comment', 'actions'];
  expandedElement: FormArray | null;

  readonly unknown: DataKind = DataKind.UNKNOWN;
  readonly none: DataKind = DataKind.NONE;
  readonly specify: DataKind = DataKind.SPECIFY;

  // Mat Chip properties
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.datasets?.statusChanges
      .subscribe(() => this.dataSource.data = this.datasets.controls);
  }

  get explanation(): FormControl {
    return this.specifyDataStep.get('explanation') as FormControl;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add dataset
    if ((value || '').trim()) {
      this.createDataset.emit(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(index: number): void {
    this.removeDataset.emit(index);
  }

  analyseFile(file: File) {
    this.fileToAnalyse.emit(file);
  }

  openDatasetDialog(index: number) {

    const dataset = this.datasets.at(index) as FormGroup;

    const dialogRef = this.dialog.open(DatasetDialogComponent, {
      width: '600px',
      data: dataset.getRawValue()
    });

    dialogRef.afterClosed().subscribe(update => {
        if (update) {
          this.updateDataset.emit({index, update});
        }
      }
    );
  }

  cancelUpload(index: number) {
    this.uploadToCancel.emit(index);
  }
}

@Component({
  selector: 'app-dataset-dialog',
  templateUrl: 'dataset-dialog.html',
  styleUrls: ['./specify-data.component.css']
})

export class DatasetDialogComponent {

  readonly FILE_TYPES = FILE_TYPES;
  readonly FILE_SIZES = FILE_SIZES;

  dataset: FormGroup = this.formService.createDatasetFormGroup(this.data.title);

  originalOrder = (): number => 0;

  constructor(
    public dialogRef: MatDialogRef<DatasetDialogComponent>,
    private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, size: number, comment: string, type: string }) {
    this.dataset.patchValue(this.data);
  }

  get title(): FormControl {
    return this.dataset.get('title') as FormControl;
  }

  get comment(): FormControl {
    return this.dataset.get('comment') as FormControl;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
