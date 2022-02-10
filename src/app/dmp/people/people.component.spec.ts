import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeopleComponent} from './people.component';
import {TranslateTestingModule} from '../../testing/translate-testing/translate-testing.module';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateTestingModule, MatCardModule, MatIconModule, ReactiveFormsModule],
      declarations: [PeopleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    component.dmpForm = new FormGroup({
      contributors: new FormArray([])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
